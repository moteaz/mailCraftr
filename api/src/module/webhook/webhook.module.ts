import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { PrismaModule } from '../../../prisma/prisma.module';
import { WebhookRepository } from '../../common/repositories/webhook.repository';
import { WebhookDeliveryService } from '../../common/services/webhook-delivery.service';
import { UserRepository } from '../../common/repositories/user.repository';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [WebhookController],
  providers: [WebhookService, WebhookRepository, WebhookDeliveryService, UserRepository],
  exports: [WebhookDeliveryService],
})
export class WebhookModule {}
