import { STORAGE_KEYS } from '@/constants';
import { isTokenExpired } from './jwt';
import type { User } from '@/types';

export const session = {
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    return token && !isTokenExpired(token) ? token : null;
  },

  setToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    document.cookie = `accessToken=${token}; path=/; max-age=86400; SameSite=Lax`;
  },

  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  },

  setUser(user: User): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  clear(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    document.cookie = 'accessToken=; path=/; max-age=0';
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
