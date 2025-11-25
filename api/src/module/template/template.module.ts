import { Module } from '@nestjs/common';
import { TemplateService } from './template.service';
import { TemplateController } from './template.controller';
import { PrismaModule } from '../../../prisma/prisma.module';
import { TemplateRepository } from '../../common/repositories/template.repository';
import { CategorieRepository } from '../../common/repositories/categorie.repository';

@Module({
  imports: [PrismaModule],
  controllers: [TemplateController],
  providers: [TemplateService, TemplateRepository, CategorieRepository],
})
export class TemplateModule {}
