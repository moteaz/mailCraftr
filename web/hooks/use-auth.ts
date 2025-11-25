import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { session } from '@/lib/auth/session';
import { ROUTES } from '@/lib/constants';
import type { LoginRequest, LoginResponse } from '@/lib/api/types';

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, setUser, logout: clearAuth } = useAuthStore();

  const login = async (credentials: LoginRequest) => {
    const data = await apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    
    session.setToken(data.accessToken);
    session.setUser(data.user);
    setUser(data.user);
    
    return data;
  };

  const logout = () => {
    clearAuth();
    router.push(ROUTES.LOGIN);
  };

  return {
    user,
    isAuthenticated,
    login,
    logout,
  };
}
