import { Controller, Get, Post, Body, Query, Patch, Param, Delete, UseGuards, ForbiddenException } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProcessName } from '@prisma/client';

@Controller('projects')
export class ProjectsController {
  // 1. DEPENDENCY INJECTION
  // This automatically gives us the "Worker" (Service) to use.
  constructor(private readonly projectsService: ProjectsService) {}

  // 2. CREATE PROJECT (POST /projects)
@Post('project')
  create(@Body() createProjectDto: CreateProjectDto) {
    // The @Body() decorator uses class-validator to check the data 
    // BEFORE this function even runs. If data is bad, it throws 400 Bad Request.
    
    // Pass the valid data to the service
    return this.projectsService.createProject(createProjectDto);
  }

  // --- NEW: THE OPERATOR POOL ---
  // Endpoint: GET /projects/pool?process=JIG_DRAWING
  @Get('pool')
  getOperatorPool(@Query('process') process: ProcessName) {
    // We expect the frontend to send ?process=JIG_DRAWING
    return this.projectsService.getOperatorPool(process);
  }

  // --- NEW: BREAKDOWN GATEKEEPER ---
  // Endpoint: PATCH /projects/:id/breakdown-complete
  // This will be used later when we build the "Unlock" button
  /* @Patch(':id/breakdown-complete')
  markBreakdownComplete(@Param('id') id: string) {
    return this.projectsService.markBreakdownComplete(id);
  } 
  */
  
  // Standard Getters
  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  // PATCH /projects/work-order/:id/start
@Patch('work-order/:id/start')
async startJob(
  @Param('id') id: string, 
  @Body('userId') userId: string // We need to know WHO is pulling it
) {
  return this.projectsService.startJob(id, userId);
}

// PATCH /projects/work-order/:id/complete
@Patch('work-order/:id/complete')
async completeJob(@Param('id') id: string) {
  return this.projectsService.completeJob(id);
}
}