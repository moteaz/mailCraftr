import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class WebhookRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    url: string;
    events: string;
    secret?: string;
    createdBy: number;
  }) {
    return this.prisma.webhook.create({
      data,
      select: {
        id: true,
        url: true,
        events: true,
        active: true,
        createdAt: true,
      },
    });
  }

  async findById(id: number) {
    return this.prisma.webhook.findUnique({
      where: { id },
    });
  }

  async findByUser(userId: number) {
    return this.prisma.webhook.findMany({
      where: { createdBy: userId },
      select: {
        id: true,
        url: true,
        events: true,
        active: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll() {
    return this.prisma.webhook.findMany({
      select: {
        id: true,
        url: true,
        events: true,
        active: true,
        createdBy: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findActiveByEvent(event: string) {
    const webhooks = await this.prisma.webhook.findMany({
      where: { active: true },
    });
    return webhooks.filter((w) => {
      const events = JSON.parse(w.events);
      return events.includes(event);
    });
  }

  async update(
    id: number,
    data: { url?: string; events?: string; active?: boolean },
  ) {
    return this.prisma.webhook.update({
      where: { id },
      data,
      select: {
        id: true,
        url: true,
        events: true,
        active: true,
        createdAt: true,
      },
    });
  }

  async delete(id: number) {
    return this.prisma.webhook.delete({
      where: { id },
    });
  }
}
