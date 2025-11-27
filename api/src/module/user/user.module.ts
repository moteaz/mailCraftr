import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../../../prisma/prisma.module';
import { UserRepository } from '../../common/repositories/user.repository';
import { EmailService } from '../../common/services/email.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, EmailService],
  exports: [UserService],
})
export class UserModule {}
