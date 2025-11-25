import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateProjectDto,
  AddUserToProjectDto,
  DeletUserfromProjectDto,
} from './dto/project.dto';
import { ProjectRepository } from '../../common/repositories/project.repository';
import { UserRepository } from '../../common/repositories/user.repository';

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(dto: CreateProjectDto, userId: number) {
    const existingProject = await this.projectRepository.findByTitle(dto.title);

    if (existingProject) {
      throw new ConflictException('Project title already in use');
    }

    const project = await this.projectRepository.create({
      title: dto.title,
      description: dto.description,
      ownerId: userId,
    });

    return {
      message: 'Project created successfully',
      project,
    };
  }

  async DeleteProject(ProjectId: number) {
    const project = await this.projectRepository.findById(ProjectId);
    
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    try {
      await this.projectRepository.delete(ProjectId);
    } catch (err) {
      throw new ConflictException(
        'Cannot delete project with associated users or data',
      );
    }

    return { message: 'Project deleted successfully', project };
  }

  async AddUserToProject(dto: AddUserToProjectDto, ProjectId: number) {
    const user = await this.userRepository.findByEmail(dto.email);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const project = await this.projectRepository.findById(ProjectId);
    
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const isInProject = await this.projectRepository.isUserInProject(
      ProjectId,
      dto.email,
    );

    if (isInProject) {
      throw new ConflictException('User already in Project');
    }

    return this.projectRepository.addUser(ProjectId, user.id);
  }

  async DeleteUserFromProject(
    dto: DeletUserfromProjectDto,
    ProjectId: number,
  ) {
    const user = await this.userRepository.findByEmail(dto.email);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const project = await this.projectRepository.findById(ProjectId);
    
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const isInProject = await this.projectRepository.isUserInProject(
      ProjectId,
      dto.email,
    );

    if (!isInProject) {
      throw new ConflictException('User is not part of this project');
    }

    return this.projectRepository.removeUser(ProjectId, user.id);
  }

  async getMyProjects(userId: number) {
    return this.projectRepository.findByUser(userId);
  }

  async getAllProjects(page: number = 1, limit: number = 10) {
    const [projects, total] = await Promise.all([
      this.projectRepository.findAll(page, limit),
      this.projectRepository.count(),
    ]);

    return {
      data: projects,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
