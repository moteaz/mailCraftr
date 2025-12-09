# 📧 MailCraftr

> Professional email template management platform with real-time webhooks and role-based access control

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)

## ✨ Features

- 🔐 **Role-Based Access Control** - SUPERADMIN and USER roles with granular permissions
- 📁 **Project Management** - Organize templates into projects and categories
- 📝 **Rich Text Editor** - CKEditor 5 integration for professional email templates
- 🔄 **Real-Time Notifications** - Server-Sent Events (SSE) for live updates
- 🪝 **Webhook System** - Subscribe to events and receive HTTP callbacks
- 🔑 **JWT Authentication** - Secure access with refresh token support
- 📊 **Template Placeholders** - Dynamic content replacement system
- 📄 **PDF Export** - Generate PDFs from templates
- 🎨 **Modern UI** - Responsive design with Tailwind CSS
- 🔒 **Security First** - Password hashing, input validation, and CORS protection

## 🛠️ Tech Stack

### Backend (API)
- **Framework**: NestJS 11
- **Language**: TypeScript 5.7
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT + Passport
- **Validation**: class-validator, class-transformer
- **Email**: Nodemailer
- **Events**: @nestjs/event-emitter

### Frontend (Web)
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Rich Text**: CKEditor 5
- **UI Components**: Custom components with Lucide icons
- **Notifications**: Sonner (toast)

## 📋 Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/moteaz/mailcraftr.git
cd mailcraftr
```

### 2. Install Backend Dependencies

```bash
cd api
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../web
npm install
```

### 4. Configure Environment Variables

#### Backend (.env)
```bash
cd api
cp .env.example .env
# Edit .env with your configuration
```

#### Frontend (.env.local)
```bash
cd web
cp .env.example .env.local
# Edit .env.local with your configuration
```

### 5. Setup Database

```bash
cd api
npx prisma generate
npx prisma migrate deploy
npm run seed
```

## 🏃 Running the Project

### Development Mode

#### Start Backend (Terminal 1)
```bash
cd api
npm run dev
```
Backend runs on: `http://localhost:4000`

#### Start Frontend (Terminal 2)
```bash
cd web
npm run dev
```
Frontend runs on: `http://localhost:3000`

### Production Mode

#### Backend
```bash
cd api
npm run build
npm run start:prod
```

#### Frontend
```bash
cd web
npm run build
npm start
```

## 🔑 Default Credentials

After running the seed script:

- **Email**: Set in `SUPERADMIN_EMAIL` env variable
- **Password**: Set in `SUPERADMIN_PASSWORD` env variable

## 📁 Project Structure

```
mailcraftr/
├── api/                          # Backend NestJS application
│   ├── prisma/
│   │   ├── migrations/          # Database migrations
│   │   ├── schema.prisma        # Prisma schema
│   │   ├── seed.ts              # Database seeder
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   ├── src/
│   │   ├── common/
│   │   │   ├── events/          # Event definitions
│   │   │   ├── filters/         # Exception filters
│   │   │   ├── repositories/    # Data access layer
│   │   │   └── services/        # Shared services
│   │   ├── config/              # Configuration
│   │   ├── module/
│   │   │   ├── auth/            # Authentication module
│   │   │   ├── user/            # User management
│   │   │   ├── project/         # Project management
│   │   │   ├── categorie/       # Category management
│   │   │   ├── template/        # Template management
│   │   │   └── webhook/         # Webhook management
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── package.json
│
├── web/                          # Frontend Next.js application
│   ├── app/
│   │   ├── dashboard/           # Dashboard pages
│   │   ├── login/               # Login page
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── common/              # Shared components
│   │   ├── layout/              # Layout components
│   │   ├── providers/           # Context providers
│   │   └── ui/                  # UI components
│   ├── config/                  # App configuration
│   ├── constants/               # Constants
│   ├── hooks/                   # Custom React hooks
│   ├── lib/
│   │   ├── api/                 # API client
│   │   ├── auth/                # Auth utilities
│   │   └── utils/               # Utility functions
│   ├── store/                   # Zustand stores
│   ├── types/                   # TypeScript types
│   ├── middleware.ts            # Next.js middleware
│   └── package.json
│
├── .gitignore
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

## 📡 API Documentation

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for detailed API endpoints and examples.

### Quick Reference

**Base URL**: `http://localhost:4000`

**Authentication**: All protected endpoints require:
```
Authorization: Bearer {your_jwt_token}
```

**Main Endpoints**:
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `GET /user` - List users (SUPERADMIN)
- `POST /project` - Create project
- `POST /categories` - Create category
- `POST /templates` - Create template
- `POST /webhooks` - Create webhook
- `GET /webhooks/events/stream` - SSE stream (SUPERADMIN)

## 🚢 Deployment

### Backend Deployment

#### Using PM2
```bash
npm install -g pm2
cd api
npm run build
pm2 start dist/main.js --name mailcraftr-api
```

#### Using Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 4000
CMD ["npm", "run", "start:prod"]
```

### Frontend Deployment

#### Vercel (Recommended)
```bash
cd web
vercel
```

#### Self-hosted
```bash
cd web
npm run build
npm start
```

## 🔒 Security Best Practices

- ✅ All passwords are hashed with bcrypt (12 rounds)
- ✅ JWT tokens with expiration
- ✅ Refresh token rotation
- ✅ Input validation on all endpoints
- ✅ CORS configuration
- ✅ Rate limiting with @nestjs/throttler
- ✅ SQL injection prevention via Prisma
- ✅ XSS protection
- ✅ Environment variable validation

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, open an issue in the repository.

---

Made with ❤️ by Moetaz Halleb
