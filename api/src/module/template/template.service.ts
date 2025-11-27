import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateTemplateDto, UpdateTemplateDto } from './dto/template.dto';
import { TemplateRepository } from '../../common/repositories/template.repository';
import { CategorieRepository } from '../../common/repositories/categorie.repository';

@Injectable()
export class TemplateService {
  constructor(
    private readonly templateRepository: TemplateRepository,
    private readonly categorieRepository: CategorieRepository,
  ) {}

  async create(dto: CreateTemplateDto, userId: number) {
    const category = await this.categorieRepository.findById(dto.categorieId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.createdById !== userId) {
      throw new ForbiddenException(
        'You can only create templates in your own categories',
      );
    }

    const existing = await this.templateRepository.findByNameAndCategory(
      dto.name,
      dto.categorieId,
    );
    if (existing) {
      throw new ConflictException(
        'Template name already exists in this category',
      );
    }

    let placeholdersArray: any[] = Array.isArray(dto.placeholders)
      ? dto.placeholders
      : [];
    placeholdersArray = placeholdersArray
      .map((p: any) => {
        if (typeof p === 'object' && p !== null && 'key' in p && 'value' in p) {
          return { key: String(p.key), value: String(p.value) };
        }
        if (Array.isArray(p) && (p as any[]).length >= 2) {
          return { key: String(p[0]), value: String(p[1]) };
        }
        return null;
      })
      .filter((p: any) => p !== null);

    const placeholdersString = JSON.stringify(placeholdersArray);

    const template = await this.templateRepository.create({
      name: dto.name,
      description: dto.description,
      content: dto.content || '',
      placeholders: placeholdersString,
      categorieId: dto.categorieId,
    });

    return {
      message: 'Template created successfully',
      template: {
        id: template.id,
        name: template.name,
        description: template.description,
        content: template.content,
        categorieId: template.categorieId,
        createdAt: template.createdAt,
        placeholders: placeholdersArray,
      },
    };
  }

  async findMyTemplates(userId: number) {
    const templates = await this.templateRepository.findByUser(userId);
    return templates;
  }

  async findOne(id: number, userId: number) {
    const template = await this.templateRepository.findById(id);
    if (!template) {
      throw new NotFoundException('Template not found');
    }

    const category = await this.categorieRepository.findById(
      template.categorieId,
    );
    if (category?.createdById !== userId) {
      throw new ForbiddenException('You can only view your own templates');
    }

    return {
      ...template,
      placeholders: template.placeholders
        ? JSON.parse(template.placeholders)
        : [],
    };
  }

  async update(id: number, dto: UpdateTemplateDto, userId: number) {
    const template = await this.templateRepository.findById(id);
    if (!template) {
      throw new NotFoundException('Template not found');
    }

    const category = await this.categorieRepository.findById(
      template.categorieId,
    );
    if (category?.createdById !== userId) {
      throw new ForbiddenException('You can only update your own templates');
    }

    if (dto.name) {
      const existing = await this.templateRepository.findByNameAndCategory(
        dto.name,
        template.categorieId,
      );
      if (existing && existing.id !== id) {
        throw new ConflictException(
          'Template name already exists in this category',
        );
      }
    }

    const updated = await this.templateRepository.update(id, {
      ...dto,
      placeholders: dto.placeholders
        ? JSON.stringify(dto.placeholders)
        : undefined,
    });

    return {
      ...updated,
      placeholders: updated.placeholders
        ? JSON.parse(updated.placeholders)
        : [],
    };
  }

  async remove(id: number, userId: number) {
    const template = await this.templateRepository.findById(id);
    if (!template) {
      throw new NotFoundException('Template not found');
    }

    const category = await this.categorieRepository.findById(
      template.categorieId,
    );
    if (category?.createdById !== userId) {
      throw new ForbiddenException('You can only delete your own templates');
    }

    await this.templateRepository.delete(id);
    return { message: 'Template deleted successfully' };
  }
}
