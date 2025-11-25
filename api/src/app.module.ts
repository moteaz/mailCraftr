import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './module/user/user.module';
import { AuthModule } from './module/auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ProjectModule } from './module/project/project.module';
import { CategorieModule } from './module/categorie/categorie.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    ProjectModule,
    CategorieModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
