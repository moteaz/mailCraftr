import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  CreateProjectDto,
  AddUserToProjectDto,
  DeletUserfromProjectDto,
} from './dto/project.dto';
import { ProjectRepository } from '../../common/repositories/project.repository';
import { UserRepository } from '../../common/repositories/user.repository';
import { WEBHOOK_EVENTS } from '../../common/events/webhook.events';

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly userRepository: UserRepository,
    private readonly eventEmitter: EventEmitter2,
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

    this.eventEmitter.emit(WEBHOOK_EVENTS.PROJECT_CREATED, {
      event: WEBHOOK_EVENTS.PROJECT_CREATED,
      timestamp: new Date().toISOString(),
      data: project,
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

    this.eventEmitter.emit(WEBHOOK_EVENTS.PROJECT_DELETED, {
      event: WEBHOOK_EVENTS.PROJECT_DELETED,
      timestamp: new Date().toISOString(),
      data: project,
    });

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

    const result = await this.projectRepository.addUser(ProjectId, user.id);

    this.eventEmitter.emit(WEBHOOK_EVENTS.PROJECT_USER_ADDED, {
      event: WEBHOOK_EVENTS.PROJECT_USER_ADDED,
      timestamp: new Date().toISOString(),
      data: { projectId: ProjectId, userId: user.id, email: user.email },
    });

    return result;
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

    const result = await this.projectRepository.removeUser(ProjectId, user.id);

    this.eventEmitter.emit(WEBHOOK_EVENTS.PROJECT_USER_REMOVED, {
      event: WEBHOOK_EVENTS.PROJECT_USER_REMOVED,
      timestamp: new Date().toISOString(),
      data: { projectId: ProjectId, userId: user.id, email: user.email },
    });

    return result;
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
