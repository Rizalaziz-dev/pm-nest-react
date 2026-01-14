import { Injectable } from '@nestjs/common';
import { Project, ProcessName, ProjectType } from '@prisma/client';
import { PrismaService } from 'src/db/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
    constructor(private readonly prisma: PrismaService) {}
    async createProject(createProjectDto: CreateProjectDto): Promise<Project> {
        const { assyNumber, customer, totalPo, etd, plotting, pmId, orderDate } = createProjectDto;
        
        // CALCULATE DEADLINE (Backward from ETD)
        // If Ploating is PROTOYPE, deadline is ETD - 1 day
        // If Ploating is REGULAR, deadline is ETD - 2 days
        const gap = plotting === 'PROTOTYPE' ? 1 : 2;
        const shipDate = new Date(etd);

        // Helper to substract days from a date
        const subtractDays = (date: Date, days: number): Date => {
            const result = new Date(date);
            result.setDate(result.getDate() - days);
            return result;
        }
        return await this.prisma.project.create({
            data: {
                assyNumber,
                customer,
                totalPo,  
                orderDate: new Date(orderDate),
                etd: shipDate,
                internalDeadline: subtractDays(shipDate, 1),
                plotting: plotting,
                pmId: pmId,

                // AUTOMATION OF CREATION OF PROJECT 
                workOrders: {
                    create: [
                // Step 1: Joint Drawing (Earliest deadline)
                { 
                processName: ProcessName.JOINT_DRAWING, 
                deadline: subtractDays(shipDate, gap * 6) 
                },
                // Step 2: Housing Drawing
                { 
                processName: ProcessName.HOUSING_DRAWING, 
                deadline: subtractDays(shipDate, gap * 5) 
                },
                // Step 3: Jig Drawing
                { 
                processName: ProcessName.JIG_DRAWING, 
                deadline: subtractDays(shipDate, gap * 4) 
                },
                // Step 4: Visual Drawing
                { 
                processName: ProcessName.VISUAL_DRAWING, 
                deadline: subtractDays(shipDate, gap * 3) 
                },
                // Step 5: Job Station Accessories
                { 
                processName: ProcessName.JOB_STATION_ACC, 
                deadline: subtractDays(shipDate, gap * 2) 
                },
                // Step 6: Job Station Finishing (Latest deadline)
                { 
                processName: ProcessName.JOB_STATION_FINISHING, 
                deadline: subtractDays(shipDate, gap * 1) 
                },
                ]
                }

            },
        });
    }

    async findAll() {
  return this.prisma.project.findMany({
    include: {
      workOrders: true, // IMPORTANT: Get the 6 steps so we can draw the progress bar!
      pm: {
        select: { name: true } // Just get the PM's name, not their password
      }
    },
    orderBy: {
      etd: 'asc' // Sort by "Ship Date" (Urgent stuff first)
    }
  });
}

}
