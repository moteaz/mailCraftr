import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { WebhookRepository } from '../repositories/webhook.repository';
import type { WebhookPayload } from '../events/webhook.events';

@Injectable()
export class WebhookDeliveryService {
  private readonly logger = new Logger(WebhookDeliveryService.name);
  private sseClients: any[] = [];

  constructor(
    private readonly webhookRepository: WebhookRepository,
  ) {}

  addSseClient(client: any) {
    this.sseClients.push(client);
    this.logger.log(`SSE client connected. Total clients: ${this.sseClients.length}`);
  }

  removeSseClient(client: any) {
    this.sseClients = this.sseClients.filter(c => c !== client);
  }

  @OnEvent('user.created')
  @OnEvent('user.updated')
  @OnEvent('user.deleted')
  @OnEvent('project.created')
  @OnEvent('project.deleted')
  @OnEvent('project.user_added')
  @OnEvent('project.user_removed')
  @OnEvent('category.created')
  @OnEvent('category.updated')
  @OnEvent('category.deleted')
  @OnEvent('template.created')
  @OnEvent('template.updated')
  @OnEvent('template.deleted')
  async handleWebhookEvent(payload: WebhookPayload) {
    this.logger.log(`Webhook event: ${payload.event}, SSE clients: ${this.sseClients.length}`);
    
    // Broadcast to SSE clients (SUPERADMIN)
    this.sseClients.forEach((client) => {
      try {
        client.write(`data: ${JSON.stringify(payload)}\n\n`);
        this.logger.log('SSE event sent successfully');
      } catch (error) {
        this.logger.error('Failed to send SSE event', error);
      }
    });

    const webhooks = await this.webhookRepository.findActiveByEvent(payload.event);

    if (webhooks.length === 0) {
      this.logger.debug(`No webhooks registered for event: ${payload.event}`);
      return;
    }

    const deliveryPromises = webhooks.map((webhook) =>
      this.deliverWebhook(webhook, payload),
    );

    await Promise.allSettled(deliveryPromises);
  }

  private async deliverWebhook(webhook: any, payload: WebhookPayload) {
    try {
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Event': payload.event,
          ...(webhook.secret && {
            'X-Webhook-Signature': this.generateSignature(payload, webhook.secret),
          }),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      this.logger.log(`Webhook delivered successfully to ${webhook.url} for event ${payload.event}`);
    } catch (error) {
      this.logger.error(
        `Failed to deliver webhook to ${webhook.url}: ${error.message}`,
      );
    }
  }

  private generateSignature(payload: WebhookPayload, secret: string): string {
    const crypto = require('crypto');
    return crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex');
  }
}
