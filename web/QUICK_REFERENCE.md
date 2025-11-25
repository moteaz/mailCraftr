# Quick Reference Card 🚀

## 📱 Responsive Classes Cheat Sheet

### Text Sizing
```tsx
text-xs sm:text-sm          // Extra small → Small
text-sm sm:text-base         // Small → Base
text-base sm:text-lg         // Base → Large
text-lg sm:text-xl           // Large → Extra Large
text-xl sm:text-2xl          // XL → 2XL
text-2xl sm:text-3xl         // 2XL → 3XL
```

### Padding
```tsx
p-3 sm:p-4 lg:p-6           // 12px → 16px → 24px
p-4 sm:p-6 lg:p-8           // 16px → 24px → 32px
px-3 sm:px-4                // Horizontal only
py-2 sm:py-3                // Vertical only
```

### Gaps
```tsx
gap-2 sm:gap-3              // 8px → 12px
gap-3 sm:gap-4              // 12px → 16px
gap-4 sm:gap-6              // 16px → 24px
```

### Grid Layouts
```tsx
// 1 column → 2 columns → 3 columns
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3

// 1 column → 2 columns → 3 columns → 4 columns
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4

// Responsive gaps
gap-3 sm:gap-4 lg:gap-6
```

### Flex Layouts
```tsx
// Stack on mobile, row on desktop
flex flex-col sm:flex-row

// Responsive gaps
flex gap-2 sm:gap-3 lg:gap-4

// Responsive alignment
items-start sm:items-center
justify-start sm:justify-between
```

### Icon Sizes
```tsx
w-4 h-4 sm:w-5 sm:h-5      // 16px → 20px
w-5 h-5 sm:w-6 sm:h-6      // 20px → 24px
w-6 h-6 sm:w-7 sm:h-7      // 24px → 28px
```

### Heights
```tsx
h-10 sm:h-12                // 40px → 48px
h-14 sm:h-16                // 56px → 64px
min-h-[200px] sm:min-h-[300px]
```

---

## 🎨 Component Quick Start

### Button
```tsx
<Button 
  variant="primary"        // primary | secondary | danger
  loading={isLoading}
  icon={PlusIcon}
>
  Click Me
</Button>
```

### Input
```tsx
<Input
  label="Email"
  name="email"
  type="email"
  icon={Mail}
  error={errors.email}
  placeholder="you@example.com"
/>
```

### Card
```tsx
<Card hover onClick={handler}>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  {/* Content */}
</Card>
```

### Modal
```tsx
<Modal 
  isOpen={isOpen} 
  onClose={onClose} 
  title="Modal Title"
  size="md"              // sm | md | lg | xl
>
  {/* Content */}
</Modal>
```

### Container
```tsx
<Container size="lg">    // sm | md | lg | xl
  {/* Content */}
</Container>
```

### PageHeader
```tsx
<PageHeader
  icon={UsersIcon}
  title="Users"
  description="Manage users"
  gradient="blue"        // blue | purple | green | orange
  action={<Button>New</Button>}
/>
```

---

## 🎯 Common Patterns

### Responsive Header
```tsx
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
  <div>
    <h1 className="text-xl sm:text-2xl font-bold">Title</h1>
    <p className="text-sm sm:text-base text-gray-600">Description</p>
  </div>
  <Button>Action</Button>
</div>
```

### Stats Grid
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
  {stats.map(stat => (
    <div key={stat.id} className="bg-white rounded-xl p-4 sm:p-6">
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

### Form Layout
```tsx
<form className="space-y-4 sm:space-y-5">
  <Input label="Name" name="name" />
  <Input label="Email" name="email" type="email" />
  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
    <Button type="submit">Submit</Button>
    <Button variant="secondary" onClick={onCancel}>Cancel</Button>
  </div>
</form>
```

### List with Actions
```tsx
<div className="space-y-3 sm:space-y-4">
  {items.map(item => (
    <div key={item.id} className="bg-white rounded-xl p-4 sm:p-6 border">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-base sm:text-lg font-semibold truncate">{item.title}</h3>
          <p className="text-sm text-gray-600 truncate">{item.description}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Edit2 className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-red-50 text-red-600 rounded-lg">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  ))}
</div>
```

---

## ✅ Checklist for New Components

- [ ] Mobile-first approach (start with base, add sm:, lg:, etc.)
- [ ] Text truncation on long content (`truncate` class)
- [ ] Responsive padding (`p-4 sm:p-6`)
- [ ] Responsive gaps (`gap-3 sm:gap-4`)
- [ ] Responsive text sizes (`text-sm sm:text-base`)
- [ ] Responsive icon sizes (`w-4 h-4 sm:w-5 sm:h-5`)
- [ ] `flex-shrink-0` on icons to prevent squishing
- [ ] `min-w-0` on flex children to allow truncation
- [ ] ARIA labels on interactive elements
- [ ] Focus states for keyboard navigation
- [ ] Touch-friendly tap targets (min 44x44px)
- [ ] Test on mobile (375px), tablet (768px), desktop (1440px)

---

## 🚫 Common Mistakes to Avoid

### ❌ Don't
```tsx
// Fixed width without responsive alternative
<div className="w-96">

// Missing text truncation
<p className="text-sm">{veryLongText}</p>

// No responsive sizing
<button className="px-4 py-2">

// Inconsistent spacing
<div className="gap-5">
```

### ✅ Do
```tsx
// Responsive width
<div className="w-full max-w-md">

// With truncation
<p className="text-sm truncate">{veryLongText}</p>

// Responsive sizing
<button className="px-3 py-2 sm:px-4 sm:py-3">

// Consistent spacing
<div className="gap-3 sm:gap-4">
```

---

## 🎨 Color Reference

### Gradients
```tsx
from-blue-600 to-indigo-600      // Blue
from-purple-600 to-pink-600      // Purple
from-green-600 to-teal-600       // Green
from-orange-600 to-red-600       // Orange
```

### Text Colors
```tsx
text-gray-900                    // Primary
text-gray-600                    // Secondary
text-gray-500                    // Muted
text-red-600                     // Error
text-blue-600                    // Link
```

### Background Colors
```tsx
bg-white                         // Card
bg-gray-50                       // Subtle
bg-gray-100                      // Hover
bg-blue-50                       // Info
bg-red-50                        // Error
```

---

## 📏 Spacing Scale

```
0.5 → 2px
1   → 4px
1.5 → 6px
2   → 8px
3   → 12px
4   → 16px
5   → 20px
6   → 24px
8   → 32px
10  → 40px
12  → 48px
```

---

## 🔍 Debug Tips

### Check Overflow
```tsx
// Add to parent to see overflow
className="border-2 border-red-500 overflow-x-auto"
```

### Check Flex Issues
```tsx
// Add to flex container
className="border-2 border-blue-500"

// Add to flex children
className="border-2 border-green-500 min-w-0"
```

### Check Responsive Breakpoints
```tsx
// Add visible indicators
<div className="block sm:hidden">Mobile</div>
<div className="hidden sm:block lg:hidden">Tablet</div>
<div className="hidden lg:block">Desktop</div>
```

---

## 💡 Pro Tips

1. **Always use `min-w-0`** on flex children that need to truncate
2. **Always use `flex-shrink-0`** on icons to prevent squishing
3. **Always use `truncate`** on text that might be long
4. **Always test** on actual mobile devices, not just browser resize
5. **Always add** ARIA labels for accessibility
6. **Use `max-w-full`** to prevent content overflow
7. **Use `overflow-x-auto`** for tables and wide content
8. **Start mobile-first**, then add larger breakpoints
9. **Use consistent spacing** from the design system
10. **Test keyboard navigation** with Tab key

---

## 📱 Test Devices

- iPhone SE (375px)
- iPhone 12/13 (390px)
- iPad (768px)
- iPad Pro (1024px)
- MacBook (1440px)
- Desktop (1920px)
- 4K (2560px)

---

## 🎯 Quick Wins

```tsx
// Make any component responsive instantly
className="
  p-4 sm:p-6 lg:p-8
  text-sm sm:text-base
  gap-3 sm:gap-4 lg:gap-6
  rounded-lg sm:rounded-xl
"
```

---

**Remember**: Mobile-first, consistent spacing, proper truncation, and accessibility! 🚀
