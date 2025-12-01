// API Configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Routes
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  USERS_LIST: '/dashboard/users',
  PROJECTS_LIST: '/dashboard/projects',
  CATEGORIES_LIST: '/dashboard/categories',
  TEMPLATES_LIST: '/dashboard/templates',
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  USER: 'authUser',
} as const;

// UI Messages
export const MESSAGES = {
  SUCCESS: {
    LOGIN: 'Welcome back!',
    USER_CREATED: 'User created successfully!',
    USER_DELETED: 'User deleted successfully!',
    PROJECT_CREATED: 'Project created successfully!',
    PROJECT_DELETED: 'Project deleted successfully!',
    CATEGORY_CREATED: 'Category created successfully!',
    CATEGORY_UPDATED: 'Category updated successfully!',
    CATEGORY_DELETED: 'Category deleted successfully!',
    TEMPLATE_CREATED: 'Template created! Now add content.',
    TEMPLATE_UPDATED: 'Template updated successfully!',
    TEMPLATE_DELETED: 'Template deleted successfully!',
    PDF_DOWNLOADED: 'PDF downloaded successfully!',
    USER_ADDED: 'User added successfully!',
    USER_REMOVED: 'User removed successfully!',
  },
  ERROR: {
    LOGIN_FAILED: 'Login failed',
    LOAD_FAILED: 'Failed to load data',
    CREATE_FAILED: 'Failed to create',
    UPDATE_FAILED: 'Failed to update',
    DELETE_FAILED: 'Failed to delete',
    REQUIRED_FIELDS: 'Please fill all required fields',
    PDF_FAILED: 'Failed to generate PDF',
  },
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  DEFAULT_PAGE: 1,
} as const;

// Color Gradients
export const GRADIENTS = {
  USERS: 'from-blue-600 to-indigo-600',
  PROJECTS: 'from-purple-600 to-pink-600',
  CATEGORIES: 'from-green-600 to-teal-600',
  TEMPLATES: 'from-orange-600 to-red-600',
} as const;
