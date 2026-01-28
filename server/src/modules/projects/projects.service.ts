import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../db/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { 
  ProcessName, 
  ProductionStage, 
  ProjectScope, 
  WorkOrderStatus,
  User,
  Project
} from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  // ===========================================================================
  // 1. PROJECT CREATION (THE SCHEDULING ENGINE)
  // ===========================================================================
  async createProject(createProjectDto: CreateProjectDto, user: User) {
    const { 
      assyNumber, 
      orderDate, 
      etd, 
      scope,       
      breakdownDays = 5, // Default duration if not provided
      ...rest 
    } = createProjectDto;

    // Calculate Breakdown Deadline  
    const breakdownTarget = new Date(orderDate);
    breakdownTarget.setDate(breakdownTarget.getDate() + breakdownDays);

    // Create Project & the gatekeeper tickets

    return this.prisma.project.create({
      data: {
        assyNumber,
        customer: createProjectDto.customer,
        totalPo: createProjectDto.totalPo,
        plotting: createProjectDto.plotting,
        orderDate,
        etd,
        scope,
        breakdownDays,

        pm: { connect: { id: user.id } },

        productionStage: ProductionStage.PLANNING, // Default start
        engineeringStatus: 'LOCKED',

        workOrders: {
          create: [
            // 1. BREAKDOWN (Gatekeeper)
            { 
              processName: ProcessName.BREAKDOWN,
              status: WorkOrderStatus.LOCKED,
              targetDate: breakdownTarget,
              hardDeadline: breakdownTarget // No buffer for gatekeeper
            }
          ]
        }
      },
      include: { workOrders: true } // Return created orders for confirmation
    });
  }

  // ===========================================================================
  // 2. THE LOGIC ENGINE (PHASE 2: Triggers when Breakdown is Done)
  // ===========================================================================
  // Call this when Operator Breakdown clicks "Complete"
  async generateEngineeringTasks(projectId: string, operatorIds?: string[]) {

    // A. GET PROJECT CONTEXT
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { pm: true }
    });

    if (!project) {
      throw new Error('Project not found');
    }

    let rules = { joint: 2, housing: 3, acc: 2, visual: 3, finish: 2, jig_offset: 3 };

    // Reduce duration for Modifications
    if (project.scope !== ProjectScope.NEW_ASSY) {
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

    // C. DATE MATH
    // Base date is NOW (because Breakdown just finished)
    const breakdownFinishDate = new Date();

    const addDays = (date: Date, days: number) => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    };

    const createDates = (baseDate: Date, duration: number) => ({
      targetDate: addDays(baseDate, duration),
      hardDeadline: addDays(baseDate, duration + 1) // +1 Day Buffer
    });
    
    const housingDates = createDates(breakdownFinishDate, rules.housing);

    // D. CREATE THE 6 ENGINEERS' WORK
    // We use createMany or multiple creates via transaction
    return this.prisma.$transaction([
        // 1. Create the new tickets
        this.prisma.workOrder.createMany({
            data: [
                { 
                  projectId, 
                  assignedUserId: operatorIds ? operatorIds[0] : null,
                  processName: ProcessName.JOINT_DRAWING, 
                  status: 'PENDING', 
                  ...createDates(breakdownFinishDate, rules.joint) },
                { 
                  projectId, 
                  assignedUserId: operatorIds ? operatorIds[1] : null,
                  processName: ProcessName.HOUSING_DRAWING, 
                  status: 'PENDING', 
                  ...housingDates },
                // Jig depends on Housing target
                { 
                  projectId, 
                  assignedUserId: operatorIds ? operatorIds[2] : null,
                  processName: ProcessName.JIG_DRAWING, 
                  status: 'PENDING', 
                  ...createDates(housingDates.targetDate, rules.jig_offset) },
                { 
                  projectId, 
                  assignedUserId: operatorIds ? operatorIds[3] : null,
                  processName: ProcessName.JOB_STATION_ACC, 
                  status: 'PENDING', 
                  ...createDates(breakdownFinishDate, rules.acc) },
                { 
                  projectId, 
                  assignedUserId: operatorIds ? operatorIds[4] : null,
                  processName: ProcessName.VISUAL_DRAWING, 
                  status: 'PENDING', 
                  ...createDates(breakdownFinishDate, rules.visual) },
                { 
                  projectId, 
                  assignedUserId: operatorIds ? operatorIds[5] : null,
                  processName: ProcessName.JOB_STATION_FINISHING, 
                  status: 'PENDING', 
                  ...createDates(breakdownFinishDate, rules.finish) },
            ]
        }),
        // 2. Mark the Breakdown ticket as COMPLETED (if not already)
        this.prisma.workOrder.updateMany({
            where: { projectId, processName: 'BREAKDOWN' },
            data: { status: 'COMPLETED', completedAt: new Date() }
        }),
        // 3. Update Project Status to PP
        this.prisma.project.update({
            where: { id: projectId },
            data: { 
                breakdownFinishDate: new Date(),
                engineeringStatus: 'PENDING',
                productionStage: 'PP'

            }
        })
    ]);
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
            customer: true,
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
      include: { workOrders: true, pm: true, },
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

  async completeJob(workOrderId: string) {
    // 1. Fetch the Work Order first
    const workOrder = await this.prisma.workOrder.findUnique({ 
        where: { id: workOrderId } 
    });

    // 2. 🛡️ SAFETY CHECK: Stop if it doesn't exist
    if (!workOrder) {
        throw new NotFoundException(`Work Order with ID ${workOrderId} not found`);
    }

    // 3. ⚡ INTERCEPTOR: If this was the Breakdown, trigger the engine
    // Now TS knows 'workOrder' is not null, so this is safe.
    if (workOrder.processName === 'BREAKDOWN') {
        await this.generateEngineeringTasks(workOrder.projectId);
    }

    // 4. Mark as Complete
    return this.prisma.workOrder.update({
      where: { id: workOrderId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date()
      }
    });
  }

  async createBulk(dtos: CreateProjectDto[], pmId: string) {
  // ⚡ START TRANSACTION
  return this.prisma.$transaction(async (tx) => {
    const createdProjects: Project[] = [];

    for (const dto of dtos) {
      // 1. Create the Project

      const existing = await tx.project.findUnique({
          where: { assyNumber: dto.assyNumber }
        });

        if (existing) {
          console.log(`Skipping duplicate: ${dto.assyNumber}`);
          continue; // ⏩ Jump to the next iteration
        }
      const project = await tx.project.create({
        data: {
          ...dto,
          pmId, // Connect the Project Manager who uploaded the file
          engineeringStatus: 'LOCKED', 
          productionStage: 'PLANNING',
          
          // Ensure dates are valid Date objects (CSV sends strings)
          orderDate: new Date(dto.orderDate),
          etd: new Date(dto.etd),
        },
      });

      // 2. Automatically Create the Breakdown Ticket
      // (Just like we did for the single project creation)
      await tx.workOrder.create({
        data: {
          projectId: project.id,
          processName: 'BREAKDOWN',
          status: 'PENDING',
          targetDate: new Date(), 
          hardDeadline: new Date(),
          // assignedUserId is left NULL for the "Grab Board" logic
        },
      });

      createdProjects.push(project);
    }

    return createdProjects; // Returns the list of all 50 new projects
  });
}
}