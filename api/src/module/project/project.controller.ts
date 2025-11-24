import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
  ParseIntPipe,
  Delete,
  Get,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import {
  CreateProjectDto,
  AddUserToProjectDto,
  DeletUserfromProjectDto,
} from './dto/project.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/Roles.guard';
import { Role } from '@prisma/client';
import { Roles } from '../user/decorator/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @Roles(Role.SUPERADMIN)
  create(@Body() createProjectDto: CreateProjectDto, @Req() req) {
    const userId = req.user.id;
    return this.projectService.create(createProjectDto, userId);
  }
  @Delete(':id')
  @Roles(Role.SUPERADMIN)
  deleteProject(@Param('id', ParseIntPipe) ProjectId: number) {
    return this.projectService.DeleteProject(ProjectId);
  }

  @Get()
  @Roles(Role.SUPERADMIN)
  getAllProjects() {
    return this.projectService.getAllProjects();
  }

  @Post(':id/add-user')
  @Roles(Role.SUPERADMIN)
  AddUserToProject(
    @Param('id', ParseIntPipe) ProjectId: number,
    @Body() AddUSerToProject: AddUserToProjectDto,
  ) {
    return this.projectService.AddUserToProject(AddUSerToProject, ProjectId);
  }

  @Delete(':id/delete-user')
  @Roles(Role.SUPERADMIN)
  DeleteUserFromProject(
    @Param('id', ParseIntPipe) ProjectId: number,
    @Body() DeletUserfromProjectDto: DeletUserfromProjectDto,
  ) {
    return this.projectService.DeleteUserFromProject(
      DeletUserfromProjectDto,
      ProjectId,
    );
  }
}
