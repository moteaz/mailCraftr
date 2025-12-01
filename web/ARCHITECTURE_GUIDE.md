# 🏗️ MailCraftr Architecture Guide

## 📁 Folder Structure & Purpose

```
web/
├── app/                    # Next.js App Router (Routes & Pages)
├── components/             # Shared UI Components
├── features/               # Feature Modules (Business Logic)
├── hooks/                  # Global Custom Hooks
├── lib/                    # Core Business Logic & Utilities
├── store/                  # Global State Management
├── types/                  # TypeScript Type Definitions
├── constants/              # App-wide Constants
└── config/                 # App Configuration
```

---

## 📂 Detailed Breakdown

### 1. `app/` - Routes & Pages Only
**Purpose**: Next.js routing and page orchestration  
**Contains**: Route folders and page components  
**Rule**: Pages should be thin - just orchestrate components and hooks

```
app/
├── (auth)/login/          # Public routes
├── (protected)/dashboard/ # Protected routes
├── layout.tsx             # Root layout
└── page.tsx               # Home page (redirects)
```

**Why?** Next.js requires this structure for routing.

---

### 2. `components/` - Shared UI Components
**Purpose**: Reusable UI components used across multiple features  
**Contains**: Generic, feature-agnostic components

```
components/
├── common/                # Shared business components
│   ├── page-header.tsx    # Page title + action button
│   ├── search-bar.tsx     # Search input with results count
│   ├── empty-state.tsx    # "No data" placeholder
│   └── confirm-dialog.tsx # Delete confirmation modal
│
├── features/              # Feature-specific shared components
│   └── categories/        # Category components used in multiple places
│
├── layout/                # Layout components
│   ├── navbar.tsx         # Top navigation bar
│   └── sidebar.tsx        # Side navigation menu
│
├── providers/             # React context providers
│   └── toast-provider.tsx # Toast notifications setup
│
└── ui/                    # Pure UI primitives (design system)
    ├── button.tsx         # Reusable button
    ├── input.tsx          # Reusable input
    ├── modal.tsx          # Reusable modal
    ├── select.tsx         # Reusable dropdown
    └── ...                # Other UI primitives
```

**Why?** DRY principle - write once, use everywhere.

---

### 3. `features/` - Feature Modules
**Purpose**: Self-contained feature logic (business logic + feature-specific UI)  
**Contains**: Everything related to a specific feature

```
features/
├── projects/
│   ├── hooks/
│   │   └── useProjects.ts          # Project business logic
│   └── components/
│       ├── ProjectCard.tsx         # Display single project
│       ├── CreateProjectModal.tsx  # Create project form
│       └── AddUserModal.tsx        # Add user to project
│
├── users/
│   ├── hooks/
│   │   └── useUsers.ts             # User business logic
│   └── components/
│       ├── UserCard.tsx            # Display single user
│       └── CreateUserModal.tsx     # Create user form
│
└── templates/
    ├── hooks/
    │   ├── useTemplates.ts         # Template CRUD logic
    │   ├── useTemplateFilters.ts   # Filter/search logic
    │   └── usePDFExport.ts         # PDF generation logic
    ├── components/
    │   ├── ui/                     # Template UI components
    │   ├── sections/               # Template page sections
    │   └── modals/                 # Template modals
    └── utils/
        └── templateHelpers.ts      # Template-specific utilities
```

**Why?** 
- **Encapsulation**: Everything for one feature in one place
- **Scalability**: Easy to add/remove features
- **Team Work**: Different devs can work on different features

---

### 4. `hooks/` - Global Custom Hooks
**Purpose**: Hooks used across multiple features  
**Contains**: Cross-cutting concern hooks

```
hooks/
├── use-auth.ts            # Authentication logic (used everywhere)
└── use-search.ts          # Generic search logic (used in multiple pages)
```

**Why?** Shared logic that doesn't belong to a specific feature.

---

### 5. `lib/` - Core Business Logic
**Purpose**: Core application logic, utilities, and services  
**Contains**: Everything that powers the app

```
lib/
├── api/
│   ├── client.ts          # HTTP client (fetch wrapper)
│   ├── endpoints.ts       # API endpoint URLs
│   └── types.ts           # API types (deprecated, redirects to /types)
│
├── auth/
│   ├── jwt.ts             # JWT token validation
│   └── session.ts         # Session management (localStorage + cookies)
│
├── services/              # API service layer (data fetching)
│   ├── user.service.ts    # User API calls
│   ├── project.service.ts # Project API calls
│   ├── category.service.ts# Category API calls
│   └── template.service.ts# Template API calls
│
└── utils/                 # Generic utilities
    ├── cn.ts              # className merger (Tailwind)
    ├── format.ts          # Date/text formatting
    └── validators.ts      # Form validation
```

**Why?** 
- **Separation**: Business logic separate from UI
- **Reusability**: Services used by multiple features
- **Testability**: Easy to unit test

---

### 6. `store/` - Global State
**Purpose**: Application-wide state management  
**Contains**: Zustand stores

```
store/
└── auth-store.ts          # User authentication state
```

**Why?** Centralized state for data needed across the entire app.

---

### 7. `types/` - TypeScript Types
**Purpose**: Centralized type definitions  
**Contains**: All TypeScript interfaces and types

```
types/
└── index.ts               # User, Project, Category, Template types
```

**Why?** Single source of truth for types - no duplication.

---

### 8. `constants/` - App Constants
**Purpose**: Centralized constants  
**Contains**: Routes, messages, config values

```
constants/
└── index.ts               # ROUTES, MESSAGES, PAGINATION, etc.
```

**Why?** Easy to update values in one place.

---

### 9. `config/` - App Configuration
**Purpose**: Environment-based configuration  
**Contains**: API URLs, app settings

```
config/
└── index.ts               # API base URL, auth config, etc.
```

**Why?** Environment-specific settings in one place.

---

## 🔄 Data Flow

```
User Action
    ↓
Page Component (app/)
    ↓
Custom Hook (features/*/hooks/)
    ↓
Service (lib/services/)
    ↓
API Client (lib/api/client.ts)
    ↓
Backend API
    ↓
Response flows back up
    ↓
UI Updates
```

---

## 🎯 Architecture Principles

### 1. **Separation of Concerns**
- **UI** (`components/`, `app/`): What users see
- **Logic** (`features/*/hooks/`, `hooks/`): What happens
- **Data** (`lib/services/`): Where data comes from

### 2. **Feature-Based Structure**
- Each feature is self-contained in `features/`
- Easy to add/remove features
- Clear boundaries

### 3. **DRY (Don't Repeat Yourself)**
- Shared UI in `components/`
- Shared logic in `hooks/` and `lib/`
- Shared types in `types/`

### 4. **Single Responsibility**
- Each file has one job
- Each component does one thing
- Each hook manages one concern

### 5. **Dependency Direction**
```
app/ → features/ → lib/ → types/
     ↘ components/ ↗
```
- Pages depend on features
- Features depend on lib
- Everyone depends on types
- No circular dependencies

---

## 📝 File Naming Conventions

- **Components**: `PascalCase.tsx` (e.g., `UserCard.tsx`)
- **Hooks**: `camelCase.ts` with `use` prefix (e.g., `useAuth.ts`)
- **Services**: `camelCase.service.ts` (e.g., `user.service.ts`)
- **Utils**: `camelCase.ts` (e.g., `validators.ts`)
- **Types**: `index.ts` (centralized)
- **Constants**: `index.ts` (centralized)

---

## ✅ Quick Reference

**Need to add a new feature?**
1. Create `features/feature-name/`
2. Add `hooks/useFeature.ts` for logic
3. Add `components/FeatureCard.tsx` for UI
4. Add `lib/services/feature.service.ts` for API
5. Add types to `types/index.ts`
6. Create page in `app/(protected)/dashboard/feature-name/page.tsx`

**Need a reusable component?**
→ Add to `components/ui/` or `components/common/`

**Need a utility function?**
→ Add to `lib/utils/`

**Need a global hook?**
→ Add to `hooks/`

**Need an API service?**
→ Add to `lib/services/`

---

## 🎉 Summary

This architecture provides:
- ✅ **Clear structure** - Easy to navigate
- ✅ **Scalability** - Easy to grow
- ✅ **Maintainability** - Easy to modify
- ✅ **Testability** - Easy to test
- ✅ **Team-friendly** - Multiple devs can work in parallel

**Your codebase follows enterprise-grade best practices! 🚀**
