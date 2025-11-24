# MailCraftr API Architecture

## 📁 Project Structure

```
api/
├── prisma/
│   ├── migrations/          # Database migrations
│   ├── schema.prisma        # Prisma schema
│   ├── prisma.module.ts     # Prisma module
│   ├── prisma.service.ts    # Prisma service
│   └── seed.ts              # Database seeding
├── src/
│   ├── common/              # Shared resources
│   │   ├── filters/         # Exception filters
│   │   ├── guards/          # Custom guards
│   │   ├── interceptors/    # Response interceptors
│   │   └── repositories/    # Data access layer
│   ├── config/              # Configuration files
│   ├── module/              # Feature modules
│   │   ├── auth/            # Authentication
│   │   ├── user/            # User management
│   │   └── project/         # Project management
│   ├── app.module.ts        # Root module
│   └── main.ts              # Application entry point
└── test/                    # E2E tests

```

## 🏗️ Architecture Patterns

### 1. **Layered Architecture**
- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic
- **Repositories**: Data access abstraction
- **DTOs**: Data validation and transformation

### 2. **Repository Pattern**
- Abstracts database operations
- Single source of truth for queries
- Easy to test and mock
- Located in `src/common/repositories/`

### 3. **Dependency Injection**
- All dependencies injected via constructor
- Promotes loose coupling
- Facilitates testing

## 🔐 Security Features

1. **JWT Authentication**: Token-based auth with passport-jwt
2. **Role-Based Access Control (RBAC)**: SUPERADMIN and USER roles
3. **Password Hashing**: bcrypt with 12 rounds
4. **Input Validation**: class-validator on all DTOs
5. **Global Exception Filter**: Sanitized error responses
6. **Timing Attack Prevention**: Constant-time password comparison
7. **CORS Configuration**: Restricted origins

## 🚀 Performance Optimizations

1. **Single Prisma Instance**: Prevents connection pool exhaustion
2. **Parallel Queries**: Promise.all for independent operations
3. **Selective Field Loading**: Only fetch required fields
4. **Database Indexing**: Indexed on email and role fields

## 📝 Best Practices

1. **Strong Typing**: TypeScript throughout
2. **DTO Validation**: All inputs validated
3. **Error Handling**: Consistent exception handling
4. **Logging**: Structured logging with NestJS Logger
5. **Environment Variables**: Centralized configuration
6. **Code Organization**: Feature-based modules

## 🧪 Testing Strategy

- Unit tests for services
- Integration tests for repositories
- E2E tests for API endpoints

## 🔄 Data Flow

```
Request → Controller → Service → Repository → Prisma → Database
                                                    ↓
Response ← Controller ← Service ← Repository ← Prisma
```

## 📦 Key Dependencies

- **NestJS**: Framework
- **Prisma**: ORM
- **Passport**: Authentication
- **class-validator**: Validation
- **bcrypt**: Password hashing
- **JWT**: Token generation
