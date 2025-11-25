import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateCategorieDto } from './dto/create-categorie.dto';
import { UpdateCategorieDto } from './dto/update-categorie.dto';
import { CategorieRepository } from '../../common/repositories/categorie.repository';
import { ProjectRepository } from '../../common/repositories/project.repository';

@Injectable()
export class CategorieService {
  constructor(
    private readonly categorieRepository: CategorieRepository,
    private readonly projectRepository: ProjectRepository,
  ) {}

  async create(dto: CreateCategorieDto, userId: number) {
    const project = await this.projectRepository.findById(dto.projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const isUserInProject = project.users.some((u) => u.id === userId);
    if (!isUserInProject && project.ownerId !== userId) {
      throw new ForbiddenException('You are not a member of this project');
    }

    const existing = await this.categorieRepository.findByNameAndProject(
      dto.name,
      dto.projectId,
    );
    if (existing) {
      throw new ConflictException(
        'This category name is not allowed. Please choose a different name.',
      );
    }

    const category = await this.categorieRepository.create({
      name: dto.name,
      description: dto.description,
      projectId: dto.projectId,
      createdById: userId,
    });

    return {
      message: 'Category created successfully',
      category,
    };
  }

  async findAll() {
    return this.categorieRepository.findAll();
  }

  async findAllByUser(userId: number) {
    return this.categorieRepository.findAllByUser(userId);
  }

  async findOne(id: number, userId: number) {
    const category = await this.categorieRepository.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.createdById !== userId) {
      throw new ForbiddenException('You can only view your own categories');
    }

    return category;
  }

  async update(id: number, dto: UpdateCategorieDto, userId: number) {
    const category = await this.categorieRepository.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.createdById !== userId) {
      throw new ForbiddenException('You can only update your own categories');
    }

    if (dto.name) {
      const existing = await this.categorieRepository.findByNameAndProject(
        dto.name,
        category.projectId,
      );
      if (existing && existing.id !== id) {
        throw new ConflictException(
          'This category name is not allowed. Please choose a different name.',
        );
      }
    }

    return this.categorieRepository.update(id, dto);
  }

  async remove(id: number, userId: number) {
    const category = await this.categorieRepository.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.createdById !== userId) {
      throw new ForbiddenException('You can only delete your own categories');
    }

    await this.categorieRepository.delete(id);
    return { message: 'Category deleted successfully' };
  }
}
