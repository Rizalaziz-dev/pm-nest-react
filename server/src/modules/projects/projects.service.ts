import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../db/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { 
  ProcessName, 
  ProductionStage, 
  ProjectScope, 
  WorkOrderStatus 
} from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  // ===========================================================================
  // 1. PROJECT CREATION (THE SCHEDULING ENGINE)
  // ===========================================================================
  async createProject(createProjectDto: CreateProjectDto) {
    const { 
      assyNumber, 
      orderDate, 
      etd, 
      scope, 
      pmId, 
      breakdownDays = 5, // Default duration if not provided
      ...rest 
    } = createProjectDto;

    // --- A. CALCULATE START DATES (Gatekeeper: Breakdown) ---
    const start = new Date(orderDate);
    
    // Engineering starts ONLY after Breakdown is finished
    const breakdownFinishDate = new Date(start);
    breakdownFinishDate.setDate(breakdownFinishDate.getDate() + breakdownDays);

    // --- B. DEFINE RULES BASED ON COMPLEXITY (Points/Effort) ---
    // Baseline Durations (Days)
    let rules = {
      joint: 2, housing: 3, acc: 2, visual: 3, finish: 2, jig_offset: 3
    };

    // ADJUSTMENT: Reduce duration if it's a Modification
    // We keep a minimum of 1 day to be safe.
    if (scope !== ProjectScope.NEW_ASSY) {
      const reduce = (val: number) => Math.max(1, val - 1);
      rules = {
        joint: reduce(rules.joint),
        housing: reduce(rules.housing),
        acc: reduce(rules.acc),
        visual: reduce(rules.visual),
        finish: reduce(rules.finish),
        jig_offset: reduce(rules.jig_offset)
      };
    }

    // --- C. DATE MATH HELPERS ---
    const addDays = (date: Date, days: number) => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    };

    // Helper: Generate Target Date (Goal) & Hard Deadline (Limit)
    // Concept: Give Operator a 'Target', but system tracks 'Hard Limit' (+1 Day Buffer)
    const createDates = (baseDate: Date, duration: number) => {
      const target = addDays(baseDate, duration);
      return {
        targetDate: target,
        hardDeadline: addDays(target, 1) // +1 Day Safety Buffer
      };
    };

    // Special Calc: Housing determines Jig start
    const housingDates = createDates(breakdownFinishDate, rules.housing);

    // --- D. DATABASE TRANSACTION ---
    return this.prisma.project.create({
      data: {
        assyNumber,
        customer: createProjectDto.customer,
        totalPo: createProjectDto.totalPo,
        plotting: createProjectDto.plotting,
        orderDate,
        etd,
        scope,           // NEW_ASSY, MODIF_MAJOR, MODIF_MINOR
        breakdownDays,
        breakdownFinishDate,
        pmId,
        productionStage: ProductionStage.PLANNING, // Default start
        engineeringStatus: 'IN_PROGRESS',

        workOrders: {
          create: [
            // 1. JOINT DRAWING (Critical for Cutting)
            { 
              processName: ProcessName.JOINT_DRAWING,
              status: WorkOrderStatus.PENDING, 
              ...createDates(breakdownFinishDate, rules.joint) 
            },
            // 2. HOUSING DRAWING (Critical for Insertion)
            { 
              processName: ProcessName.HOUSING_DRAWING, 
              status: WorkOrderStatus.PENDING,
              targetDate: housingDates.targetDate,
              hardDeadline: housingDates.hardDeadline
            },
            // 3. JIG DRAWING (Depends on Housing)
            { 
              processName: ProcessName.JIG_DRAWING, 
              status: WorkOrderStatus.PENDING,
              ...createDates(housingDates.targetDate, rules.jig_offset) 
            },
            // 4. ACCESSORIES (Parallel)
            { 
              processName: ProcessName.JOB_STATION_ACC, 
              status: WorkOrderStatus.PENDING,
              ...createDates(breakdownFinishDate, rules.acc) 
            },
            // 5. VISUAL (Parallel)
            { 
              processName: ProcessName.VISUAL_DRAWING, 
              status: WorkOrderStatus.PENDING,
              ...createDates(breakdownFinishDate, rules.visual) 
            },
            // 6. FINISHING (Parallel)
            { 
              processName: ProcessName.JOB_STATION_FINISHING, 
              status: WorkOrderStatus.PENDING,
              ...createDates(breakdownFinishDate, rules.finish) 
            }
          ]
        
        }
      },
      include: { workOrders: true } // Return created orders for confirmation
    });
  }

  // ===========================================================================
  // 2. OPERATOR POOL (THE PRESSURE ENGINE)
  // ===========================================================================
  // Call this via Controller: @Get('pool/:processName')
  async getOperatorPool(processName: ProcessName) {
    
    // --- A. FETCH RELEVANT TASKS ---
    const tasks = await this.prisma.workOrder.findMany({
      where: {
        processName: processName,
        // Only show items that are ready to work on
        status: { in: [WorkOrderStatus.PENDING, WorkOrderStatus.IN_PROGRESS] } 
      },
      include: {
        // IMPORTANT: We need Project details to calculate Pressure Score
        project: { 
          select: { 
            scope: true, 
            assyNumber: true, 
            productionStage: true,
            breakdownFinishDate: true
          } 
        }
      }
    });

    // --- B. HELPER: CALCULATE POINTS ---
    const getPoints = (scope: ProjectScope) => {
      switch (scope) {
        case ProjectScope.NEW_ASSY: return 100;    // Heavy
        case ProjectScope.MODIF_MAJOR: return 60;  // Medium
        case ProjectScope.MODIF_MINOR: return 20;  // Light
        default: return 100;
      }
    };

    // --- C. HELPER: CHECK FACTORY PRESSURE ---
    // If Stage is anything other than PLANNING, the factory has started.
    const isFactoryActive = (stage: ProductionStage) => {
      return stage !== ProductionStage.PLANNING; 
    };

    // --- D. CALCULATE OVERLOAD STATUS ---
    // If total points > 200 (approx 8 hours work), we are overloaded.
    const totalPoints = tasks.reduce((sum, t) => sum + getPoints(t.project.scope), 0);
    const isOverloaded = totalPoints > 200; 

    // --- E. THE SMART SORT (TRIAGE LOGIC) ---
    const sortedTasks = tasks.sort((a, b) => {
      
      // PRIORITY 1: FACTORY STATUS (The "Line Stop" Rule)
      // If Project A is in Cutting (PP) but B is Planning, A wins instantly.
      const factoryA = isFactoryActive(a.project.productionStage);
      const factoryB = isFactoryActive(b.project.productionStage);

      if (factoryA && !factoryB) return -1; // A to Top
      if (!factoryA && factoryB) return 1;  // B to Top

      // PRIORITY 2: DEADLINE URGENCY
      // If factory status is equal, who is dying today?
      const now = new Date();
      const urgentA = a.hardDeadline <= now;
      const urgentB = b.hardDeadline <= now;

      if (urgentA && !urgentB) return -1;
      if (!urgentA && urgentB) return 1;

      // PRIORITY 3: TRIAGE (Quick Kill)
      // If both are Urgent OR we are Overloaded, do the SMALL points first.
      if (isOverloaded || (urgentA && urgentB)) {
        return getPoints(a.project.scope) - getPoints(b.project.scope);
        // Result: 20 pts (Minor) comes before 100 pts (New)
      }

      // PRIORITY 4: DEFAULT (Target Date)
      // If all else is safe, just follow the schedule.
      return a.targetDate.getTime() - b.targetDate.getTime();
    });

    return {
      metadata: {
        totalPoints,
        isOverloaded,
        count: tasks.length
      },
      pool: sortedTasks
    };
  }

  // ===========================================================================
  // 3. STANDARD HELPERS
  // ===========================================================================
  
  async findAll() {
    return this.prisma.project.findMany({
      include: { workOrders: true, pm: true },
      orderBy: { orderDate: 'desc' }
    });
  }

  async findOne(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
      include: { workOrders: true, revisions: true }
    });
  }

  async startJob(workOrderId: string, userId: string) {
  return this.prisma.workOrder.update({
    where: { id: workOrderId },
    data: {
      status: 'IN_PROGRESS',
      assignedUserId: userId,
      // If you added a 'startedAt' column, set it here:
      // startedAt: new Date() 
    }
  });
}
}