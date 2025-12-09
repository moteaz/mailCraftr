# MailCraftr API Documentation

## Base URL
```
http://localhost:4000
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer {your_jwt_token}
```

---

## 🔐 Authentication Endpoints

### POST /auth/login
Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "a1b2c3d4e5f6...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "USER"
  }
}
```

**Errors:**
- `401 Unauthorized` - Invalid credentials

---

### POST /auth/refresh
Refresh access token using refresh token.

**Request:**
```json
{
  "refreshToken": "a1b2c3d4e5f6..."
}
```

**Response:** `200 OK`
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**
- `401 Unauthorized` - Invalid or expired refresh token

---

### POST /auth/logout
Logout and invalidate refresh token.

**Request:**
```json
{
  "refreshToken": "a1b2c3d4e5f6..."
}
```

**Response:** `200 OK`
```json
{
  "message": "Logged out successfully"
}
```

---

## 👥 User Endpoints (SUPERADMIN only)

### POST /user
Create a new user. Credentials are sent via email.

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "email": "newuser@example.com",
  "password": "SecurePass123!",
  "role": "USER"
}
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%*?&)

**Response:** `201 Created`
```json
{
  "message": "User created successfully and credentials sent via email",
  "user": {
    "id": 2,
    "email": "newuser@example.com",
    "role": "USER",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Errors:**
- `409 Conflict` - Email already in use
- `403 Forbidden` - Not a SUPERADMIN

---

### GET /user
Get all users with pagination.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 10)

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": 1,
      "email": "admin@mailcraftr.com",
      "role": "SUPERADMIN",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "email": "user@example.com",
      "role": "USER",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "meta": {
    "total": 15,
    "page": 1,
    "limit": 10,
    "totalPages": 2
  }
}
```

---

### GET /user/:id
Get user by ID.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "id": 1,
  "email": "user@example.com",
  "role": "USER",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Errors:**
- `404 Not Found` - User not found

---

### PATCH /user/:id
Update user details.

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "email": "updated@example.com",
  "password": "NewPass123!",
  "role": "USER"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "email": "updated@example.com",
  "role": "USER",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Errors:**
- `404 Not Found` - User not found
- `409 Conflict` - Cannot modify SUPERADMIN user

---

### DELETE /user/:id
Delete a user.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "id": 1,
  "email": "user@example.com",
  "role": "USER"
}
```

**Errors:**
- `404 Not Found` - User not found
- `409 Conflict` - Cannot delete SUPERADMIN or user with dependencies

---

## 📁 Project Endpoints

### POST /project
Create a new project (SUPERADMIN only).

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "title": "Marketing Campaign 2024",
  "description": "Email templates for Q1 marketing"
}
```

**Response:** `201 Created`
```json
{
  "message": "Project created successfully",
  "project": {
    "id": 1,
    "title": "Marketing Campaign 2024",
    "description": "Email templates for Q1 marketing",
    "ownerId": 1,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Errors:**
- `409 Conflict` - Project title already exists

---

### GET /project/my-projects
Get projects accessible to current user.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "title": "Marketing Campaign 2024",
    "description": "Email templates for Q1 marketing",
    "ownerId": 1,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

### GET /project
Get all projects with pagination (SUPERADMIN only).

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 10)

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": 1,
      "title": "Marketing Campaign 2024",
      "description": "Email templates for Q1 marketing",
      "ownerId": 1,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "owner": {
        "id": 1,
        "email": "admin@mailcraftr.com"
      },
      "users": [
        { "id": 2, "email": "user@example.com" }
      ]
    }
  ],
  "meta": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

### POST /project/:id/add-user
Add user to project (SUPERADMIN only).

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "Marketing Campaign 2024",
  "users": [
    { "id": 2, "email": "user@example.com" }
  ]
}
```

**Errors:**
- `404 Not Found` - User or project not found
- `409 Conflict` - User already in project

---

### DELETE /project/:id/delete-user
Remove user from project (SUPERADMIN only).

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "Marketing Campaign 2024",
  "users": []
}
```

**Errors:**
- `404 Not Found` - User or project not found
- `409 Conflict` - User not in project

---

### DELETE /project/:id
Delete a project (SUPERADMIN only).

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "message": "Project deleted successfully",
  "project": {
    "id": 1,
    "title": "Marketing Campaign 2024"
  }
}
```

**Errors:**
- `404 Not Found` - Project not found

---

## 📂 Category Endpoints

### POST /categories
Create a new category.

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "name": "Welcome Emails",
  "description": "Onboarding email templates",
  "projectId": 1
}
```

**Response:** `201 Created`
```json
{
  "message": "Category created successfully",
  "category": {
    "id": 1,
    "name": "Welcome Emails",
    "description": "Onboarding email templates",
    "projectId": 1,
    "createdById": 1,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "project": {
      "id": 1,
      "title": "Marketing Campaign 2024"
    },
    "createdBy": {
      "id": 1,
      "email": "user@example.com"
    }
  }
}
```

**Errors:**
- `404 Not Found` - Project not found
- `403 Forbidden` - Not a member of the project
- `409 Conflict` - Category name already exists in project

---

### GET /categories/my-categories
Get categories created by current user.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Welcome Emails",
    "description": "Onboarding email templates",
    "projectId": 1,
    "createdById": 1,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "project": {
      "id": 1,
      "title": "Marketing Campaign 2024"
    },
    "createdBy": {
      "id": 1,
      "email": "user@example.com"
    }
  }
]
```

---

### GET /categories/all
Get all categories (SUPERADMIN only).

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Welcome Emails",
    "description": "Onboarding email templates",
    "projectId": 1,
    "createdById": 1,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

### GET /categories/:id
Get category by ID.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Welcome Emails",
  "description": "Onboarding email templates",
  "projectId": 1,
  "createdById": 1,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "createdBy": {
    "id": 1,
    "email": "user@example.com"
  },
  "templates": [
    {
      "id": 1,
      "name": "Welcome Email",
      "content": "<h1>Welcome!</h1>"
    }
  ]
}
```

**Errors:**
- `404 Not Found` - Category not found
- `403 Forbidden` - Can only view own categories

---

### PATCH /categories/:id
Update category.

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "name": "Updated Name",
  "description": "Updated description"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Updated Name",
  "description": "Updated description",
  "projectId": 1,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Errors:**
- `404 Not Found` - Category not found
- `403 Forbidden` - Can only update own categories
- `409 Conflict` - Category name already exists

---

### DELETE /categories/:id
Delete category.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "message": "Category deleted successfully"
}
```

**Errors:**
- `404 Not Found` - Category not found
- `403 Forbidden` - Can only delete own categories

---

## 📝 Template Endpoints

### POST /templates
Create a new template.

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "name": "Welcome Email",
  "description": "First email to new users",
  "content": "<h1>Welcome {{name}}!</h1><p>Your email is {{email}}</p>",
  "placeholders": [
    { "key": "name", "value": "John Doe" },
    { "key": "email", "value": "john@example.com" }
  ],
  "categorieId": 1
}
```

**Response:** `201 Created`
```json
{
  "message": "Template created successfully",
  "template": {
    "id": 1,
    "name": "Welcome Email",
    "description": "First email to new users",
    "content": "<h1>Welcome {{name}}!</h1><p>Your email is {{email}}</p>",
    "categorieId": 1,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "placeholders": [
      { "key": "name", "value": "John Doe" },
      { "key": "email", "value": "john@example.com" }
    ]
  }
}
```

**Errors:**
- `404 Not Found` - Category not found
- `403 Forbidden` - Can only create templates in own categories
- `409 Conflict` - Template name already exists in category

---

### GET /templates/my-templates
Get templates created by current user.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Welcome Email",
    "description": "First email to new users",
    "content": "<h1>Welcome {{name}}!</h1>",
    "placeholders": "[{\"key\":\"name\",\"value\":\"John Doe\"}]",
    "categorieId": 1,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "categorie": {
      "id": 1,
      "name": "Welcome Emails"
    }
  }
]
```

---

### GET /templates/:id
Get template by ID.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Welcome Email",
  "description": "First email to new users",
  "content": "<h1>Welcome {{name}}!</h1>",
  "placeholders": [
    { "key": "name", "value": "John Doe" }
  ],
  "categorieId": 1,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "categorie": {
    "id": 1,
    "name": "Welcome Emails",
    "projectId": 1
  }
}
```

**Errors:**
- `404 Not Found` - Template not found
- `403 Forbidden` - Can only view own templates

---

### PATCH /templates/:id
Update template.

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "name": "Updated Welcome Email",
  "description": "Updated description",
  "content": "<h1>Hello {{name}}!</h1>",
  "placeholders": [
    { "key": "name", "value": "Jane Doe" }
  ]
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Updated Welcome Email",
  "description": "Updated description",
  "content": "<h1>Hello {{name}}!</h1>",
  "placeholders": [
    { "key": "name", "value": "Jane Doe" }
  ],
  "categorieId": 1,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Errors:**
- `404 Not Found` - Template not found
- `403 Forbidden` - Can only update own templates
- `409 Conflict` - Template name already exists

---

### DELETE /templates/:id
Delete template.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "message": "Template deleted successfully"
}
```

**Errors:**
- `404 Not Found` - Template not found
- `403 Forbidden` - Can only delete own templates

---

## 🪝 Webhook Endpoints

### POST /webhooks
Create a new webhook.

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "url": "https://your-domain.com/webhook",
  "events": ["user.created", "template.created"],
  "secret": "optional_secret_key"
}
```

**Response:** `201 Created`
```json
{
  "message": "Webhook created successfully",
  "webhook": {
    "id": 1,
    "url": "https://your-domain.com/webhook",
    "events": ["user.created", "template.created"],
    "active": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### GET /webhooks/my-webhooks
Get webhooks created by current user.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "url": "https://your-domain.com/webhook",
    "events": ["user.created", "template.created"],
    "active": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

### GET /webhooks/all
Get all webhooks (SUPERADMIN only).

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "url": "https://your-domain.com/webhook",
    "events": ["user.created"],
    "active": true,
    "createdBy": 1,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

### GET /webhooks/:id
Get webhook by ID.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "id": 1,
  "url": "https://your-domain.com/webhook",
  "events": ["user.created", "template.created"],
  "active": true,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Errors:**
- `404 Not Found` - Webhook not found
- `403 Forbidden` - Can only view own webhooks (unless SUPERADMIN)

---

### PATCH /webhooks/:id
Update webhook.

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "url": "https://new-domain.com/webhook",
  "events": ["user.created", "user.updated"],
  "active": false
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "url": "https://new-domain.com/webhook",
  "events": ["user.created", "user.updated"],
  "active": false,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Errors:**
- `404 Not Found` - Webhook not found
- `403 Forbidden` - Can only update own webhooks (unless SUPERADMIN)

---

### DELETE /webhooks/:id
Delete webhook.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "message": "Webhook deleted successfully"
}
```

**Errors:**
- `404 Not Found` - Webhook not found
- `403 Forbidden` - Can only delete own webhooks (unless SUPERADMIN)

---

### GET /webhooks/events/stream
Stream webhook events via Server-Sent Events (SUPERADMIN only).

**Query Parameters:**
- `token` (required) - JWT access token

**Response:** `text/event-stream`

**Example:**
```javascript
const token = 'your_jwt_token';
const eventSource = new EventSource(`http://localhost:4000/webhooks/events/stream?token=${token}`);

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Event:', data.event);
  console.log('Data:', data.data);
};
```

**Event Format:**
```json
{
  "event": "user.created",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "role": "USER"
  }
}
```

---

## 📡 Webhook Events

Available webhook events:

### User Events
- `user.created` - New user created
- `user.updated` - User updated
- `user.deleted` - User deleted

### Project Events
- `project.created` - New project created
- `project.deleted` - Project deleted
- `project.user_added` - User added to project
- `project.user_removed` - User removed from project

### Category Events
- `category.created` - New category created
- `category.updated` - Category updated
- `category.deleted` - Category deleted

### Template Events
- `template.created` - New template created
- `template.updated` - Template updated
- `template.deleted` - Template deleted

---

## 🔒 Error Responses

All error responses follow this format:

```json
{
  "statusCode": 400,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/endpoint",
  "message": "Error message"
}
```

### Common Status Codes
- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict
- `500 Internal Server Error` - Server error

---

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- Pagination starts at page 1
- Maximum page limit is 100
- Webhook signatures use HMAC-SHA256
- SSE connections auto-reconnect on disconnect
- Rate limiting: 10 requests per 60 seconds per IP
