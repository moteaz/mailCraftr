import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class TemplateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByNameAndCategory(name: string, categorieId: number) {
    return this.prisma.template.findUnique({
      where: { name_categorieId: { name, categorieId } },
    });
  }

  async findById(id: number) {
    return this.prisma.template.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        content: true,
        placeholders: true,
        categorieId: true,
        createdAt: true,
        categorie: {
          select: { id: true, name: true, projectId: true },
        },
      },
    });
  }

  async findByCategory(categorieId: number) {
    return this.prisma.template.findMany({
      where: { categorieId },
      select: {
        id: true,
        name: true,
        description: true,
        content: true,
        placeholders: true,
        categorieId: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUser(userId: number) {
    return this.prisma.template.findMany({
      where: {
        categorie: {
          createdById: userId,
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        content: true,
        placeholders: true,
        categorieId: true,
        createdAt: true,
        categorie: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: {
    name: string;
    description?: string;
    content?: string;
    placeholders: string;
    categorieId: number;
  }) {
    return this.prisma.template.create({
      data: {
        ...data,
        content: data.content || '',
      },
      select: {
        id: true,
        name: true,
        description: true,
        content: true,
        placeholders: true,
        categorieId: true,
        createdAt: true,
      },
    });
  }

  async update(
    id: number,
    data: {
      name?: string;
      description?: string;
      content?: string;
      placeholders?: string;
    },
  ) {
    return this.prisma.template.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        description: true,
        content: true,
        placeholders: true,
        categorieId: true,
        createdAt: true,
      },
    });
  }

  async delete(id: number) {
    return this.prisma.template.delete({
      where: { id },
    });
  }
}
