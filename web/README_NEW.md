# MailCraftr - Professional Email Management Platform

A modern, production-ready Next.js application with TypeScript, following SOLID principles and clean architecture.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
web/
├── app/
│   ├── (auth)/              # Public authentication routes
│   ├── (protected)/         # Protected dashboard routes
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home redirect
├── components/
│   ├── ui/                  # Reusable UI components
│   ├── layout/              # Layout components (Navbar, Sidebar)
│   └── providers/           # React providers
├── lib/
│   ├── api/                 # API client and types
│   ├── auth/                # Authentication utilities
│   ├── utils/               # Helper functions
│   └── constants.ts         # App-wide constants
├── hooks/                   # Custom React hooks
├── store/                   # Zustand state management
└── middleware.ts            # Route protection
```

## 🎯 Key Features

- ✅ **Type-Safe API Client** - Centralized HTTP client with TypeScript
- ✅ **Route Protection** - Middleware-based authentication
- ✅ **State Management** - Zustand for global state
- ✅ **Modern UI** - Gradient designs, glass morphism, smooth animations
- ✅ **Toast Notifications** - User feedback with Sonner
- ✅ **Form Validation** - Reusable validators
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Clean Architecture** - Separation of concerns

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State**: Zustand
- **Notifications**: Sonner
- **Icons**: Lucide React

## 📦 Dependencies

```json
{
  "dependencies": {
    "lucide-react": "^0.554.0",
    "next": "16.0.3",
    "react": "19.2.0",
    "react-dom": "19.2.0",
    "sonner": "^1.7.1",
    "zustand": "^5.0.2"
  }
}
```

## 🔐 Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## 📚 Architecture

### **API Layer** (`lib/api/`)
Centralized HTTP client with automatic token injection and error handling.

```typescript
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

const data = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
```

### **State Management** (`store/`)
Zustand for lightweight, performant global state.

```typescript
import { useAuthStore } from '@/store/auth-store';

const { user, isAuthenticated, logout } = useAuthStore();
```

### **Custom Hooks** (`hooks/`)
Reusable business logic abstraction.

```typescript
import { useAuth } from '@/hooks/use-auth';

const { login, logout, createUser } = useAuth();
```

### **Route Protection** (`middleware.ts`)
Automatic redirect for protected routes.

## 🎨 UI Components

### Button
```typescript
<Button 
  loading={isLoading} 
  icon={LogIn}
  variant="primary"
>
  Sign In
</Button>
```

### Input
```typescript
<Input
  label="Email"
  icon={Mail}
  error={errors.email}
  {...register('email')}
/>
```

## 🔒 Security

- Environment-based configuration
- JWT token validation
- Route-level protection
- Secure session management
- No sensitive data in client

## 📱 Responsive Design

- Mobile-first approach
- Collapsible sidebar
- Touch-friendly interactions
- Optimized for all screen sizes

## 🧪 Code Quality

- **SOLID Principles**
- **DRY** - No code duplication
- **KISS** - Simple, readable code
- **Type Safety** - 100% TypeScript coverage
- **Clean Architecture** - Clear separation of concerns

## 🚀 Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📖 Documentation

- [Refactoring Guide](./REFACTORING_GUIDE.md) - Detailed changes and improvements
- [Cleanup Guide](./CLEANUP.md) - Remove old files

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript strictly
3. Keep components small and focused
4. Write meaningful commit messages

## 📄 License

© 2025 MailCraftr. All rights reserved.
