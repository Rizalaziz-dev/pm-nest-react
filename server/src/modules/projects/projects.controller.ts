import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ForbiddenException } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';

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

  // 3. GET ALL PROJECTS (GET /projects)
  // You'll need this for your Dashboard later
  // @Get()
  // findAll() {
  //   return this.projectsService.findAll(); // You need to create this in Service!
  // }
}