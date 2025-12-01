import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateCategorieDto } from './dto/create-categorie.dto';
import { UpdateCategorieDto } from './dto/update-categorie.dto';
import { CategorieRepository } from '../../common/repositories/categorie.repository';
import { ProjectRepository } from '../../common/repositories/project.repository';
import { WEBHOOK_EVENTS } from '../../common/events/webhook.events';

@Injectable()
export class CategorieService {
  constructor(
    private readonly categorieRepository: CategorieRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly eventEmitter: EventEmitter2,
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

    const payload = {
      event: WEBHOOK_EVENTS.CATEGORY_CREATED,
      timestamp: new Date().toISOString(),
      data: category,
    };
    console.log('Emitting webhook event:', payload.event);
    this.eventEmitter.emit(WEBHOOK_EVENTS.CATEGORY_CREATED, payload);

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

    const updated = await this.categorieRepository.update(id, dto);

    const payload = {
      event: WEBHOOK_EVENTS.CATEGORY_UPDATED,
      timestamp: new Date().toISOString(),
      data: updated,
    };
    console.log('Emitting webhook event:', payload.event);
    this.eventEmitter.emit(WEBHOOK_EVENTS.CATEGORY_UPDATED, payload);

    return updated;
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

    const payload = {
      event: WEBHOOK_EVENTS.CATEGORY_DELETED,
      timestamp: new Date().toISOString(),
      data: { id },
    };
    console.log('Emitting webhook event:', payload.event);
    this.eventEmitter.emit(WEBHOOK_EVENTS.CATEGORY_DELETED, payload);

    return { message: 'Category deleted successfully' };
  }
}
