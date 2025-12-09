# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2024-12-09

### Added
- Initial release of MailCraftr
- User authentication with JWT and refresh tokens
- Role-based access control (SUPERADMIN, USER)
- Project management system
- Category organization within projects
- Rich text email template editor with CKEditor 5
- Template placeholder system for dynamic content
- Webhook system with event subscriptions
- Real-time notifications via Server-Sent Events (SSE)
- PDF export functionality for templates
- User management (SUPERADMIN only)
- Project collaboration (add/remove users)
- Responsive UI with Tailwind CSS
- Email notification system for new user credentials
- Comprehensive API with RESTful endpoints
- Database migrations with Prisma
- Input validation and sanitization
- CORS protection
- Rate limiting
- Password hashing with bcrypt
- Automatic database seeding for SUPERADMIN
- Search functionality across all entities
- Pagination support for large datasets

### Security
- Implemented JWT-based authentication
- Added refresh token rotation
- Password complexity requirements
- SQL injection prevention via Prisma ORM
- XSS protection
- CSRF protection
- Secure HTTP headers
- Environment variable validation

[Unreleased]: https://github.com/moetaz/mailcraftr/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/moetaz/mailcraftr/releases/tag/v1.0.0
