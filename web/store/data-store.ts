import { create } from 'zustand';
import type { User, Project } from '@/lib/api/types';

interface DataState {
  users: User[];
  projects: Project[];
  setUsers: (users: User[]) => void;
  setProjects: (projects: Project[]) => void;
}

export const useDataStore = create<DataState>((set) => ({
  users: [],
  projects: [],
  setUsers: (users) => set({ users }),
  setProjects: (projects) => set({ projects }),
}));
