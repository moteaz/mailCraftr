import { Module } from '@nestjs/common';
import { CategorieService } from './categorie.service';
import { CategorieController } from './categorie.controller';
import { PrismaModule } from '../../../prisma/prisma.module';
import { CategorieRepository } from '../../common/repositories/categorie.repository';
import { ProjectRepository } from '../../common/repositories/project.repository';

@Module({
  imports: [PrismaModule],
  controllers: [CategorieController],
  providers: [CategorieService, CategorieRepository, ProjectRepository],
})
export class CategorieModule {}
