# MailCraftr Responsive Design Guide

## 📱 Breakpoint System

```typescript
Mobile:   320px - 639px   (default, no prefix)
Tablet:   640px - 1023px  (sm:)
Laptop:   1024px - 1279px (lg:)
Desktop:  1280px - 1535px (xl:)
Large:    1536px+          (2xl:)
```

## 🎨 Design System

### Spacing Scale
- `xs`: gap-2 (8px)
- `sm`: gap-3 (12px)
- `md`: gap-4 (16px)
- `lg`: gap-6 (24px)
- `xl`: gap-8 (32px)

### Container Widths
- `sm`: max-w-2xl (672px)
- `md`: max-w-4xl (896px)
- `lg`: max-w-6xl (1152px)
- `xl`: max-w-7xl (1280px)

### Typography
- Headings: Use responsive classes like `text-xl sm:text-2xl lg:text-3xl`
- Body: `text-sm sm:text-base`
- Small: `text-xs sm:text-sm`

### Border Radius
- Small: `rounded-lg` (8px)
- Medium: `rounded-xl` (12px)
- Large: `rounded-2xl` (16px)

### Shadows
- Small: `shadow-sm`
- Medium: `shadow-md`
- Large: `shadow-lg`
- Extra: `shadow-xl`

## 🧩 Reusable Components

### Container
```tsx
import { Container } from '@/components/ui/container';

<Container size="lg">
  {/* Your content */}
</Container>
```

### Card
```tsx
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

<Card hover onClick={handleClick}>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
</Card>
```

### Modal
```tsx
import { Modal } from '@/components/ui/modal';

<Modal isOpen={isOpen} onClose={onClose} title="Modal Title" size="md">
  {/* Modal content */}
</Modal>
```

### PageHeader
```tsx
import { PageHeader } from '@/components/ui/page-header';
import { Users } from 'lucide-react';

<PageHeader
  icon={Users}
  title="Users"
  description="Manage system users"
  gradient="blue"
  action={<Button>New User</Button>}
/>
```

## 📐 Layout Patterns

### Dashboard Grid
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
  {/* Cards */}
</div>
```

### Two Column Layout
```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
  {/* Content */}
</div>
```

### Sidebar + Content
```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
  <div className="lg:col-span-2">{/* Main content */}</div>
  <div>{/* Sidebar */}</div>
</div>
```

## ✅ Responsive Checklist

### Typography
- [ ] Use responsive text sizes (text-sm sm:text-base)
- [ ] Truncate long text with `truncate` class
- [ ] Use `min-w-0` on flex children to allow truncation

### Spacing
- [ ] Use responsive padding (p-4 sm:p-6 lg:p-8)
- [ ] Use responsive gaps (gap-3 sm:gap-4 lg:gap-6)
- [ ] Adjust margins for mobile (mb-4 sm:mb-6)

### Layout
- [ ] Stack on mobile, grid on desktop
- [ ] Use `flex-col sm:flex-row` for horizontal layouts
- [ ] Add `overflow-x-auto` for tables/wide content
- [ ] Use `max-w-full` to prevent overflow

### Components
- [ ] Buttons: Responsive padding and icon sizes
- [ ] Inputs: Responsive padding and label sizes
- [ ] Modals: Responsive width and padding
- [ ] Cards: Responsive padding and spacing

### Images & Icons
- [ ] Use responsive icon sizes (w-4 h-4 sm:w-5 sm:h-5)
- [ ] Add `flex-shrink-0` to prevent icon squishing
- [ ] Use `object-cover` for images

### Interactions
- [ ] Touch-friendly tap targets (min 44x44px)
- [ ] Proper focus states for keyboard navigation
- [ ] ARIA labels for screen readers
- [ ] Disabled states clearly visible

## 🎯 Common Patterns

### Responsive Button Group
```tsx
<div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
  <Button>Primary</Button>
  <Button variant="secondary">Secondary</Button>
</div>
```

### Responsive Header with Action
```tsx
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
  <div>
    <h1 className="text-xl sm:text-2xl font-bold">Title</h1>
    <p className="text-sm sm:text-base text-gray-600">Description</p>
  </div>
  <Button>Action</Button>
</div>
```

### Responsive Stats Grid
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
  {stats.map(stat => (
    <div className="bg-white rounded-xl p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm text-gray-600 truncate">{stat.label}</p>
          <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
        </div>
        <Icon className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0" />
      </div>
    </div>
  ))}
</div>
```

### Responsive Form
```tsx
<form className="space-y-4 sm:space-y-5">
  <Input label="Email" />
  <Input label="Password" type="password" />
  <Button type="submit">Submit</Button>
</form>
```

## 🚀 Performance Tips

1. **Minimize DOM elements**: Use semantic HTML
2. **Avoid deep nesting**: Keep component tree shallow
3. **Use CSS Grid/Flexbox**: Instead of absolute positioning
4. **Lazy load images**: Use Next.js Image component
5. **Optimize fonts**: Use next/font for automatic optimization

## 🎨 Color System

### Gradients
- Blue: `from-blue-600 to-indigo-600`
- Purple: `from-purple-600 to-pink-600`
- Green: `from-green-600 to-teal-600`
- Orange: `from-orange-600 to-red-600`

### Text Colors
- Primary: `text-gray-900`
- Secondary: `text-gray-600`
- Muted: `text-gray-500`
- Error: `text-red-600`

### Background Colors
- Page: `bg-gradient-to-br from-gray-50 to-gray-100`
- Card: `bg-white`
- Hover: `hover:bg-gray-100`

## 📱 Mobile-First Approach

Always start with mobile styles, then add larger breakpoints:

```tsx
// ✅ Good
<div className="p-4 sm:p-6 lg:p-8">

// ❌ Bad
<div className="lg:p-8 sm:p-6 p-4">
```

## 🔍 Testing Checklist

- [ ] Test on iPhone SE (375px)
- [ ] Test on iPad (768px)
- [ ] Test on laptop (1440px)
- [ ] Test on 4K display (2560px)
- [ ] Test with browser zoom (150%, 200%)
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility
- [ ] Test touch interactions on mobile
