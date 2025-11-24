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
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProjectDto, userId: number) {
    const existingProject = await this.prisma.project.findUnique({
      where: { title: dto.title },
    });

    if (existingProject) {
      throw new ConflictException('Project already in use');
    }

    const project = await this.prisma.project.create({
      data: {
        title: dto.title,
        description: dto.description,
        ownerId: userId,
      },
    });

    return {
      message: 'Project created successfully',
      project: {
        id: project.id,
        title: project.title,
        description: project.description,
        ownerId: project.ownerId,
        createdAt: project.createdAt,
      },
    };
  }

  async AddUserToProject(dto: AddUserToProjectDto, ProjectId: number) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new NotFoundException('User not found');

    // Check project exists
    const project = await this.prisma.project.findUnique({
      where: { id: ProjectId },
    });
    if (!project) throw new NotFoundException('Project not found');

    const isInProject = await this.prisma.project.findFirst({
      where: {
        id: ProjectId,
        users: {
          some: { id: user.id }, // <--- checks if user is already connected
        },
      },
    });

    if (isInProject) {
      throw new ConflictException('User already in Project');
    }
    // Add user to project
    return this.prisma.project.update({
      where: { id: ProjectId },
      data: {
        users: {
          connect: { id: user.id },
        },
      },
      include: {
        users: true,
      },
    });
  }

  async DeleteUserFromProject(dto: DeletUserfromProjectDto, ProjectId: number) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new NotFoundException('User not found');

    // Check project exists
    const project = await this.prisma.project.findUnique({
      where: { id: ProjectId },
    });

    if (!project) throw new NotFoundException('Project not found');
    const isInProject = await this.prisma.project.findFirst({
      where: {
        id: ProjectId,
        users: {
          some: { id: user.id }, // <--- checks if user is already connected
        },
      },
    });

    if (!isInProject) {
      throw new ConflictException('User is not part of this project');
    }

    // Delet user to project
    return this.prisma.project.update({
      where: { id: ProjectId },
      data: {
        users: {
          disconnect: { id: user.id },
        },
      },
      include: {
        users: true,
      },
    });
  }
}
