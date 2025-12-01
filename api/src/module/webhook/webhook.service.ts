import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateWebhookDto, UpdateWebhookDto } from './dto/webhook.dto';
import { WebhookRepository } from '../../common/repositories/webhook.repository';

@Injectable()
export class WebhookService {
  constructor(private readonly webhookRepository: WebhookRepository) {}

  async create(dto: CreateWebhookDto, userId: number) {
    const webhook = await this.webhookRepository.create({
      url: dto.url,
      events: JSON.stringify(dto.events),
      secret: dto.secret,
      createdBy: userId,
    });

    return {
      message: 'Webhook created successfully',
      webhook: {
        ...webhook,
        events: JSON.parse(webhook.events),
      },
    };
  }

  async findMyWebhooks(userId: number) {
    const webhooks = await this.webhookRepository.findByUser(userId);
    return webhooks.map((w) => ({
      ...w,
      events: JSON.parse(w.events),
    }));
  }

  async findAll() {
    const webhooks = await this.webhookRepository.findAll();
    return webhooks.map((w) => ({
      ...w,
      events: JSON.parse(w.events),
    }));
  }

  async findOne(id: number, userId: number, isSuperAdmin: boolean) {
    const webhook = await this.webhookRepository.findById(id);
    if (!webhook) {
      throw new NotFoundException('Webhook not found');
    }

    if (!isSuperAdmin && webhook.createdBy !== userId) {
      throw new ForbiddenException('You can only view your own webhooks');
    }

    return {
      ...webhook,
      events: JSON.parse(webhook.events),
    };
  }

  async update(
    id: number,
    dto: UpdateWebhookDto,
    userId: number,
    isSuperAdmin: boolean,
  ) {
    const webhook = await this.webhookRepository.findById(id);
    if (!webhook) {
      throw new NotFoundException('Webhook not found');
    }

    if (!isSuperAdmin && webhook.createdBy !== userId) {
      throw new ForbiddenException('You can only update your own webhooks');
    }

    const updated = await this.webhookRepository.update(id, {
      ...dto,
      events: dto.events ? JSON.stringify(dto.events) : undefined,
    });

    return {
      ...updated,
      events: JSON.parse(updated.events),
    };
  }

  async remove(id: number, userId: number, isSuperAdmin: boolean) {
    const webhook = await this.webhookRepository.findById(id);
    if (!webhook) {
      throw new NotFoundException('Webhook not found');
    }

    if (!isSuperAdmin && webhook.createdBy !== userId) {
      throw new ForbiddenException('You can only delete your own webhooks');
    }

    await this.webhookRepository.delete(id);
    return { message: 'Webhook deleted successfully' };
  }
}
