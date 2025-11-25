import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CategorieRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByNameAndProject(name: string, projectId: number) {
    return this.prisma.categorie.findUnique({
      where: { name_projectId: { name, projectId } },
    });
  }

  async findById(id: number) {
    return this.prisma.categorie.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        projectId: true,
        createdById: true,
        createdAt: true,
        createdBy: {
          select: { id: true, email: true },
        },
        templates: {
          select: { id: true, name: true, content: true },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.categorie.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        projectId: true,
        createdById: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllByUser(userId: number) {
    return this.prisma.categorie.findMany({
      where: {
        createdById: userId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        projectId: true,
        createdById: true,
        createdAt: true,
        project: {
          select: { id: true, title: true },
        },
        createdBy: {
          select: { id: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: {
    name: string;
    description?: string;
    projectId: number;
    createdById: number;
  }) {
    return this.prisma.categorie.create({
      data,
      select: {
        id: true,
        name: true,
        description: true,
        projectId: true,
        createdById: true,
        createdAt: true,
        project: {
          select: { id: true, title: true },
        },
        createdBy: {
          select: { id: true, email: true },
        },
      },
    });
  }

  async update(id: number, data: { name?: string; description?: string }) {
    return this.prisma.categorie.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        description: true,
        projectId: true,
        createdAt: true,
      },
    });
  }

  async delete(id: number) {
    return this.prisma.categorie.delete({
      where: { id },
    });
  }
}
