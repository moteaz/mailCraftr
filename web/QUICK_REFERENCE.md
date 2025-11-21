# 🚀 Quick Reference Guide

## 📦 Installation

```bash
npm install
```

## 🔧 Environment Setup

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## 🏃 Run Development

```bash
npm run dev
```

---

## 🎯 Common Tasks

### Make an API Call
```typescript
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

const data = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
```

### Use Auth
```typescript
import { useAuth } from '@/hooks/use-auth';

const { user, login, logout, createUser } = useAuth();
```

### Access Global State
```typescript
import { useAuthStore } from '@/store/auth-store';

const { user, isAuthenticated, setUser, logout } = useAuthStore();
```

### Validate Form
```typescript
import { validators, validationMessages } from '@/lib/utils/validators';

if (!validators.email(email)) {
  errors.email = validationMessages.email.invalid;
}
```

### Show Toast
```typescript
import { toast } from 'sonner';

toast.success('Success!');
toast.error('Error!');
toast.info('Info!');
```

### Navigate
```typescript
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';

const router = useRouter();
router.push(ROUTES.DASHBOARD);
```

### Combine Classes
```typescript
import { cn } from '@/lib/utils/cn';

className={cn('base-class', isActive && 'active-class', className)}
```

---

## 🎨 UI Components

### Button
```typescript
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

<Button 
  type="submit"
  loading={isLoading}
  loadingText="Signing in..."
  icon={LogIn}
  variant="primary"
>
  Sign In
</Button>
```

### Input
```typescript
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';

<Input
  label="Email"
  name="email"
  type="email"
  value={form.email}
  onChange={handleChange}
  placeholder="you@example.com"
  icon={Mail}
  error={errors.email}
  disabled={loading}
/>
```

### Spinner
```typescript
import { Spinner } from '@/components/ui/spinner';

<Spinner />
```

---

## 📁 File Locations

| What | Where |
|------|-------|
| API calls | `lib/api/client.ts` |
| API endpoints | `lib/api/endpoints.ts` |
| API types | `lib/api/types.ts` |
| Auth logic | `hooks/use-auth.ts` |
| Global state | `store/auth-store.ts` |
| Validators | `lib/utils/validators.ts` |
| Constants | `lib/constants.ts` |
| UI components | `components/ui/` |
| Layout | `components/layout/` |
| Pages | `app/(protected)/dashboard/` |
| Login | `app/(auth)/login/` |

---

## 🔐 Auth Flow

1. User enters credentials
2. `useAuth().login()` called
3. API client sends request
4. Token saved to localStorage
5. User saved to Zustand store
6. Redirect to dashboard
7. Middleware checks token
8. Dashboard layout initializes auth
9. User sees protected content

---

## 🎯 Best Practices

### ✅ Do
- Use `apiClient` for all API calls
- Use `useAuth()` for auth operations
- Use `validators` for form validation
- Use `toast` for user feedback
- Use `cn()` for conditional classes
- Use TypeScript types everywhere
- Keep components small and focused
- Separate UI from business logic

### ❌ Don't
- Don't use `fetch` directly
- Don't access localStorage directly
- Don't repeat validation logic
- Don't mix UI and business logic
- Don't use `any` type
- Don't hardcode URLs or constants

---

## 🐛 Debugging

### Check Auth State
```typescript
const { user, isAuthenticated } = useAuthStore();
console.log({ user, isAuthenticated });
```

### Check Token
```typescript
import { session } from '@/lib/auth/session';
console.log(session.getToken());
console.log(session.isAuthenticated());
```

### Check API Response
```typescript
try {
  const data = await apiClient.post(endpoint, body);
  console.log('Success:', data);
} catch (err) {
  console.error('Error:', err);
}
```

---

## 📚 Documentation Files

- **SUMMARY.md** - Overview of all changes
- **BEFORE_AFTER.md** - Detailed comparisons
- **REFACTORING_GUIDE.md** - Technical details
- **MIGRATION_CHECKLIST.md** - Step-by-step migration
- **CLEANUP.md** - Files to delete
- **README_NEW.md** - Project documentation

---

## 🆘 Common Issues

### Module not found
```bash
npm install
```

### Environment variable not working
Restart dev server after creating `.env.local`

### Old components showing
```bash
rmdir /s /q .next
npm run dev
```

### TypeScript errors
Delete old files (see CLEANUP.md)

---

## 🎓 Learn More

- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zustand Docs](https://zustand-demo.pmnd.rs/)
- [Sonner Toast](https://sonner.emilkowal.ski/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)

---

**Happy coding! 🎉**
