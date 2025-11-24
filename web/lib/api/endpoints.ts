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
    CREATE: "/project",
    PAGINATED: (page: number, limit: number) => `/project?page=${page}&limit=${limit}`,
  },
} as const;
