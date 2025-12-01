import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import type { Webhook } from '@/types';

export const webhookService = {
  create: (data: { url: string; events: string[]; secret?: string }) =>
    apiClient.post<{ message: string; webhook: Webhook }>(API_ENDPOINTS.WEBHOOK.CREATE, data),

  getMyWebhooks: () =>
    apiClient.get<Webhook[]>(API_ENDPOINTS.WEBHOOK.MY_WEBHOOKS),

  getAll: () =>
    apiClient.get<Webhook[]>(API_ENDPOINTS.WEBHOOK.ALL),

  getById: (id: number) =>
    apiClient.get<Webhook>(API_ENDPOINTS.WEBHOOK.BY_ID(id)),

  update: (id: number, data: { url?: string; events?: string[]; active?: boolean }) =>
    apiClient.patch<Webhook>(API_ENDPOINTS.WEBHOOK.UPDATE(id), data),

  delete: (id: number) =>
    apiClient.delete<{ message: string }>(API_ENDPOINTS.WEBHOOK.DELETE(id)),
};
