import { create } from 'zustand';
import type { User } from '@/types';
import { session } from '@/lib/auth/session';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  logout: () => {
    session.clear();
    set({ user: null, isAuthenticated: false });
  },

  initialize: () => {
    const user = session.getUser();
    const isAuthenticated = session.isAuthenticated();
    set({ user, isAuthenticated });
  },
}));
