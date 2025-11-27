import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { Template } from '@/lib/api/types';

export const templateService = {
  getMyTemplates: () => apiClient.get<Template[]>(API_ENDPOINTS.TEMPLATE.MY_TEMPLATES),

  create: (data: {
    name: string;
    description: string;
    content: string;
    categorieId: number;
    placeholders: { key: string; value: string }[];
  }) => apiClient.post(API_ENDPOINTS.TEMPLATE.CREATE, data),

  update: (id: number, data: { content: string }) =>
    apiClient.patch(API_ENDPOINTS.TEMPLATE.UPDATE(id), data),

  delete: (id: number) => apiClient.delete(API_ENDPOINTS.TEMPLATE.DELETE(id)),
};
