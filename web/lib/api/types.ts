export type UserRole = 'USER' | 'SUPERADMIN';

export interface User {
  id: number;
  email: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface CreateUserRequest {
  email: string;
  password: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  ownerId: number;
  createdAt: string;
  users: any[];
}

export interface ApiError {
  message: string;
  statusCode?: number;
}
