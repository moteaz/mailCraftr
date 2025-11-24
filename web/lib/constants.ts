export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  USERS_CREATE: '/dashboard/users/create',
  PROJECTS_LIST: '/dashboard/projects',
  PROJECTS_CREATE: '/dashboard/projects/create',
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  USER: 'authUser',
} as const;
