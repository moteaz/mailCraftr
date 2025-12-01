import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserModule } from './module/user/user.module';
import { AuthModule } from './module/auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ProjectModule } from './module/project/project.module';
import { CategorieModule } from './module/categorie/categorie.module';
import { TemplateModule } from './module/template/template.module';
import { WebhookModule } from './module/webhook/webhook.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
    }),
    EventEmitterModule.forRoot(),
    PrismaModule,
    AuthModule,
    UserModule,
    ProjectModule,
    CategorieModule,
    TemplateModule,
    WebhookModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
