export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  USERS_LIST: '/dashboard/users',
  PROJECTS_LIST: '/dashboard/projects',
  CATEGORIES_LIST: '/dashboard/categories',
  TEMPLATES_LIST: '/dashboard/templates',
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  USER: 'authUser',
} as const;
