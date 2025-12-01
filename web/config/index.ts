// Application Configuration
export const config = {
  app: {
    name: 'MailCraftr',
    version: '1.0.0',
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
    timeout: 30000,
  },
  auth: {
    tokenKey: 'accessToken',
    userKey: 'authUser',
    tokenExpiry: 3600, // 1 hour 
  },
} as const;
