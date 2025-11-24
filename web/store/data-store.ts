import { create } from 'zustand';
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { User, Project } from '@/lib/api/types';

interface DataState {
  users: User[];
  projects: Project[];
  usersLoaded: boolean;
  projectsLoaded: boolean;
  setUsers: (users: User[]) => void;
  setProjects: (projects: Project[]) => void;
  fetchUsers: () => Promise<void>;
  fetchProjects: () => Promise<void>;
  refetchUsers: () => Promise<void>;
  refetchProjects: () => Promise<void>;
}

export const useDataStore = create<DataState>((set, get) => ({
  users: [],
  projects: [],
  usersLoaded: false,
  projectsLoaded: false,
  
  setUsers: (users) => set({ users, usersLoaded: true }),
  setProjects: (projects) => set({ projects, projectsLoaded: true }),
  
  fetchUsers: async () => {
    if (get().usersLoaded) return;
    const users = await apiClient.get<User[]>(API_ENDPOINTS.USER.LIST);
    set({ users, usersLoaded: true });
  },
  
  fetchProjects: async () => {
    if (get().projectsLoaded) return;
    const projects = await apiClient.get<Project[]>(API_ENDPOINTS.PROJECT.LIST);
    set({ projects, projectsLoaded: true });
  },
  
  refetchUsers: async () => {
    const users = await apiClient.get<User[]>(API_ENDPOINTS.USER.LIST);
    set({ users, usersLoaded: true });
  },
  
  refetchProjects: async () => {
    const projects = await apiClient.get<Project[]>(API_ENDPOINTS.PROJECT.LIST);
    set({ projects, projectsLoaded: true });
  },
}));
