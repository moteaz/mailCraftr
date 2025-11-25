import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ProjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByTitle(title: string) {
    return this.prisma.project.findUnique({
      where: { title },
    });
  }

  async findById(id: number) {
    return this.prisma.project.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        ownerId: true,
        createdAt: true,
        users: {
          select: { id: true, email: true },
        },
      },
    });
  }

  async findByUser(userId: number) {
    return this.prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { users: { some: { id: userId } } },
        ],
      },
      select: {
        id: true,
        title: true,
        description: true,
        ownerId: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return this.prisma.project.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        ownerId: true,
        createdAt: true,
        owner: {
          select: { id: true, email: true },
        },
        users: {
          select: { id: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });
  }

  async count(): Promise<number> {
    return this.prisma.project.count();
  }

  async create(data: { title: string; description?: string; ownerId: number }) {
    return this.prisma.project.create({
      data,
      select: {
        id: true,
        title: true,
        description: true,
        ownerId: true,
        createdAt: true,
      },
    });
  }

  async delete(id: number) {
    return this.prisma.project.delete({
      where: { id },
    });
  }

  async addUser(projectId: number, userId: number) {
    return this.prisma.project.update({
      where: { id: projectId },
      data: {
        users: { connect: { id: userId } },
      },
      select: {
        id: true,
        title: true,
        users: {
          select: { id: true, email: true },
        },
      },
    });
  }

  async removeUser(projectId: number, userId: number) {
    return this.prisma.project.update({
      where: { id: projectId },
      data: {
        users: { disconnect: { id: userId } },
      },
      select: {
        id: true,
        title: true,
        users: {
          select: { id: true, email: true },
        },
      },
    });
  }

  async isUserInProject(
    projectId: number,
    userEmail: string,
  ): Promise<boolean> {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        users: {
          some: { email: userEmail },
        },
      },
    });
    return !!project;
  }
}
