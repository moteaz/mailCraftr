import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

export const userService = {
  getAll: () => apiClient.get<any>(API_ENDPOINTS.USER.LIST),

  getPaginated: (page: number, limit: number) =>
    apiClient.get<any>(API_ENDPOINTS.USER.PAGINATED(page, limit)),

  create: (data: { email: string; password: string }) =>
    apiClient.post(API_ENDPOINTS.USER.CREATE, data),

  delete: (userId: number) => apiClient.delete(`/user/${userId}`),
};
