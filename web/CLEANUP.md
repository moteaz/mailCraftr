# Cleanup Old Files

## Files to Delete

Run these commands to remove old/duplicate files:

```bash
# Remove old context
rmdir /s /q context

# Remove old dashboard structure
rmdir /s /q app\dashboard

# Remove old components
del app\components\inputs\FormInput.tsx
del app\components\SubmitButton.tsx
del app\components\dashboard\dashboardLayout.tsx
del app\components\dashboard\MobileSidebarContent.tsx
del app\components\dashboard\navBar.tsx
del app\components\dashboard\sideBar.tsx
rmdir /s /q app\components\dashboard

# Remove old utilities
del app\utils\auth.ts
rmdir /s /q app\utils

# Remove old hooks
del hooks\useAuth.ts

# Remove old lib files
del lib\jwt.ts
```

## Or manually delete:
- `context/` folder
- `app/dashboard/` folder (old structure)
- `app/components/inputs/FormInput.tsx`
- `app/components/SubmitButton.tsx`
- `app/components/dashboard/` folder
- `app/utils/` folder
- `hooks/useAuth.ts` (old version)
- `lib/jwt.ts` (old version)

## Keep these new files:
- `lib/api/` ✅
- `lib/auth/` ✅
- `lib/utils/` ✅
- `store/` ✅
- `hooks/use-auth.ts` ✅
- `components/ui/` (new versions) ✅
- `components/layout/` ✅
- `components/providers/` ✅
- `app/(protected)/dashboard/` ✅
- `middleware.ts` ✅
