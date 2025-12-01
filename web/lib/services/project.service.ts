import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { Project } from '@/types';

export const projectService = {
  getMyProjects: () => apiClient.get<Project[]>(API_ENDPOINTS.PROJECT.MY_PROJECTS),

  getPaginated: (page: number, limit: number) =>
    apiClient.get<any>(API_ENDPOINTS.PROJECT.PAGINATED(page, limit)),

  create: (data: { title: string; description: string }) =>
    apiClient.post(API_ENDPOINTS.PROJECT.CREATE, data),

  addUser: (projectId: number, email: string) =>
    apiClient.post(`/project/${projectId}/add-user`, { email }),

  removeUser: (projectId: number, email: string) =>
    apiClient.delete(`/project/${projectId}/delete-user`, { email }),

  delete: (projectId: number) => apiClient.delete(`/project/${projectId}`),
};
