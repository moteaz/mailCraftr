export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
  },
  USER: {
    CREATE: "/user",
    LIST: "/user",
    PAGINATED: (page: number, limit: number) => `/user?page=${page}&limit=${limit}`,
  },
  PROJECT: {
    LIST: "/project",
    MY_PROJECTS: "/project/my-projects",
    CREATE: "/project",
    PAGINATED: (page: number, limit: number) => `/project?page=${page}&limit=${limit}`,
  },
  CATEGORY: {
    CREATE: "/categories",
    MY_CATEGORIES: "/categories/my-categories",
    BY_ID: (id: number) => `/categories/${id}`,
    UPDATE: (id: number) => `/categories/${id}`,
    DELETE: (id: number) => `/categories/${id}`,
  },
  TEMPLATE: {
    CREATE: "/templates",
    MY_TEMPLATES: "/templates/my-templates",
    BY_ID: (id: number) => `/templates/${id}`,
    UPDATE: (id: number) => `/templates/${id}`,
    DELETE: (id: number) => `/templates/${id}`,
  },
  WEBHOOK: {
    CREATE: "/webhooks",
    MY_WEBHOOKS: "/webhooks/my-webhooks",
    ALL: "/webhooks/all",
    BY_ID: (id: number) => `/webhooks/${id}`,
    UPDATE: (id: number) => `/webhooks/${id}`,
    DELETE: (id: number) => `/webhooks/${id}`,
  },
} as const;
