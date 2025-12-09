# Contributing to MailCraftr

First off, thank you for considering contributing to MailCraftr! 🎉

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if possible**
- **Include your environment details** (OS, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any alternatives you've considered**

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. Ensure the test suite passes
4. Make sure your code lints
5. Issue that pull request!

## Development Process

### Branch Naming Convention

- `feature/` - New features (e.g., `feature/add-email-scheduling`)
- `fix/` - Bug fixes (e.g., `fix/login-validation`)
- `docs/` - Documentation changes (e.g., `docs/update-readme`)
- `refactor/` - Code refactoring (e.g., `refactor/auth-service`)
- `test/` - Adding tests (e.g., `test/user-controller`)
- `chore/` - Maintenance tasks (e.g., `chore/update-dependencies`)

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, missing semi-colons, etc.)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvements
- `test`: Adding missing tests
- `chore`: Changes to build process or auxiliary tools

#### Examples:
```
feat(auth): add refresh token rotation

Implement automatic refresh token rotation for enhanced security.
Tokens are now rotated on each refresh request.

Closes #123
```

```
fix(template): resolve placeholder replacement bug

Fixed issue where nested placeholders were not being replaced correctly.

Fixes #456
```

### Code Style

#### TypeScript/JavaScript
- Use TypeScript for all new code
- Follow the existing ESLint configuration
- Use meaningful variable names
- Add JSDoc comments for public APIs
- Keep functions small and focused
- Use async/await over promises

#### Backend (NestJS)
- Follow NestJS best practices
- Use dependency injection
- Implement proper error handling
- Use DTOs for validation
- Keep controllers thin, services fat
- Use repositories for data access

#### Frontend (Next.js)
- Use functional components with hooks
- Keep components small and reusable
- Use TypeScript interfaces for props
- Follow the existing folder structure
- Use custom hooks for shared logic

### Testing

- Write unit tests for new features
- Ensure all tests pass before submitting PR
- Aim for >80% code coverage
- Test edge cases and error scenarios

```bash
# Backend tests
cd api
npm test

# Frontend tests
cd web
npm test
```

### Code Review Process

1. At least one maintainer must approve the PR
2. All CI checks must pass
3. Code must follow style guidelines
4. Tests must be included for new features
5. Documentation must be updated if needed

## Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] All tests passing

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added and passing

## Related Issues
Closes #(issue number)

## Screenshots (if applicable)
```

## Setting Up Development Environment

### Backend Setup
```bash
cd api
npm install
cp .env.example .env
# Edit .env with your settings
npx prisma generate
npx prisma migrate dev
npm run seed
npm run dev
```

### Frontend Setup
```bash
cd web
npm install
cp .env.example .env.local
# Edit .env.local with your settings
npm run dev
```

## Questions?

Feel free to open an issue with your question or contact the maintainers directly.

Thank you for contributing! 🚀
