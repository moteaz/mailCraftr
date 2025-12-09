// User & Auth Types
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
  refreshToken?: string;
  user: User;
}

// Project Types
export interface Project {
  id: number;
  title: string;
  description: string;
  ownerId: number;
  createdAt: string;
  users: any[];
}

// Category Types
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

// Template Types
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

// Webhook Types
export interface Webhook {
  id: number;
  url: string;
  events: string[];
  active: boolean;
  createdAt: string;
}

export const WEBHOOK_EVENTS = {
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  USER_DELETED: 'user.deleted',
  PROJECT_CREATED: 'project.created',
  PROJECT_DELETED: 'project.deleted',
  PROJECT_USER_ADDED: 'project.user_added',
  PROJECT_USER_REMOVED: 'project.user_removed',
  CATEGORY_CREATED: 'category.created',
  CATEGORY_UPDATED: 'category.updated',
  CATEGORY_DELETED: 'category.deleted',
  TEMPLATE_CREATED: 'template.created',
  TEMPLATE_UPDATED: 'template.updated',
  TEMPLATE_DELETED: 'template.deleted',
} as const;

// API Types
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
