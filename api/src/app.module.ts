import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './module/user/user.module';
import { AuthModule } from './module/auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module'; // for PrismaService
import { ProjectModule } from './module/project/project.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UserModule,
    ProjectModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
