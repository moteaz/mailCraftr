import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { ProjectRepository } from '../../common/repositories/project.repository';
import { UserRepository } from '../../common/repositories/user.repository';

@Module({
  imports: [PrismaModule],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectRepository, UserRepository],
})
export class ProjectModule {}
