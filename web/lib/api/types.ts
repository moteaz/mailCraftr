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

export interface Category {
  id: number;
  name: string;
  description?: string;
  projectId: number;
  createdById: number;
  createdAt: string;
  project?: {
    id: number;
    title: string;
  };
  createdBy?: {
    id: number;
    email: string;
  };
  templates?: Template[];
}

export interface Template {
  id: number;
  name: string;
  description?: string;
  content: string;
  placeholders: { key: string; value: string }[];
  categorieId: number;
  createdAt: string;
  categorie?: {
    id: number;
    name: string;
  };
}

export interface ApiError {
  message: string;
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
