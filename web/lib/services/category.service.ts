import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { Category } from '@/types';

export const categoryService = {
  getMyCategories: () => apiClient.get<Category[]>(API_ENDPOINTS.CATEGORY.MY_CATEGORIES),

  create: (data: { name: string; description: string; projectId: number }) =>
    apiClient.post(API_ENDPOINTS.CATEGORY.CREATE, data),

  update: (id: number, data: { name: string; description: string }) =>
    apiClient.patch(API_ENDPOINTS.CATEGORY.UPDATE(id), data),

  delete: (id: number) => apiClient.delete(API_ENDPOINTS.CATEGORY.DELETE(id)),
};
