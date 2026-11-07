# Senabil Community Impact Platform — API Guide

> **Platform:** Humanitarian aid and community impact management  
> **Stack:** Node.js · Express · TypeScript · PostgreSQL · Prisma ORM · JWT  
> **Server:** `http://localhost:5000` (development) | `https://your-api.com` (production)

---

## Table of Contents
1. [Quick Start](#quick-start)
2. [Authentication](#authentication)
3. [Roles & Authorization](#roles--authorization)
4. [Environment Variables](#environment-variables)
5. [Domain Overview](#domain-overview)
6. [API Endpoints](#api-endpoints)
7. [Business Workflows](#business-workflows)
8. [Data Models](#data-models)
9. [Error Handling](#error-handling)
10. [Testing Guide](#testing-guide)

---

## Quick Start

### 1. Start the server
```bash
cd server
npm install
npx prisma generate
npx prisma db push
npm run dev
```

### 2. Verify server is running
```
GET {{baseUrl}}/api/health
```
Expected: `{ "status": "ok", "service": "Senabil Community Impact Platform API" }`

### 3. Select the `development` environment in Postman

### 4. Register or Login — token is auto-saved to `{{token}}`

---

## Authentication

All protected endpoints use **JWT Bearer Token** authentication.

### Token Flow
```
POST /api/auth/register  →  { token, user }
POST /api/auth/login     →  { token, user }
```

The token is automatically extracted by the afterResponse script and stored in `{{token}}`. All collection requests inherit Bearer auth from the collection root.

### Token Structure (JWT payload)
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "role": "BENEFICIARY | VOLUNTEER | ADMIN",
  "iat": 1700000000,
  "exp": 1700604800
}
```

**Expiry:** 7 days (configurable via `JWT_EXPIRES_IN`)

---

## Roles & Authorization

| Role | Description | Capabilities |
|------|-------------|--------------|
| `BENEFICIARY` | Aid recipient | Browse projects, submit applications, track status, notifications |
| `VOLUNTEER` | Aid provider | Browse projects, submit applications, track status, notifications |
| `ADMIN` | Platform manager | All of the above + create/edit/delete projects, review applications, dashboard, audit logs |

### Route Access Matrix

| Endpoint Group | Public | BENEFICIARY | VOLUNTEER | ADMIN |
|----------------|--------|-------------|-----------|-------|
| Auth (register/login) | ✅ | ✅ | ✅ | ✅ |
| GET /api/projects | ✅ | ✅ | ✅ | ✅ |
| GET /api/projects/featured | ✅ | ✅ | ✅ | ✅ |
| GET /api/public/stats | ✅ | ✅ | ✅ | ✅ |
| GET /api/users/me | ❌ | ✅ | ✅ | ✅ |
| POST /api/applications | ❌ | ✅ | ✅ | ✅ |
| GET /api/notifications | ❌ | ✅ | ✅ | ✅ |
| POST /api/projects | ❌ | ❌ | ❌ | ✅ |
| PATCH /api/projects/:id | ❌ | ❌ | ❌ | ✅ |
| DELETE /api/projects/:id | ❌ | ❌ | ❌ | ✅ |
| GET /api/applications (all) | ❌ | ❌ | ❌ | ✅ |
| PATCH /api/applications/:id/review | ❌ | ❌ | ❌ | ✅ |
| GET /api/dashboard/* | ❌ | ❌ | ❌ | ✅ |

---

## Environment Variables

### Server (.env)
| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Server port |
| `NODE_ENV` | `development` | Environment name |
| `DATABASE_URL` | `postgresql://postgres@localhost:5432/senabil_db` | PostgreSQL connection string |
| `JWT_SECRET` | `senabil_impact_secret_key_2026_super_secure` | JWT signing secret |
| `JWT_EXPIRES_IN` | `7d` | Token expiry (e.g., `7d`, `24h`) |
| `CLIENT_URL` | `http://localhost:5173` | Frontend origin for CORS |

### Postman Environment Variables
| Variable | Scope | Description | Auto-set? |
|----------|-------|-------------|-----------|
| `baseUrl` | Both | API base URL | No — set manually |
| `token` | Both | JWT Bearer token | ✅ After login/register |
| `userId` | Both | Current user UUID | ✅ After login/register |
| `projectId` | Both | Active project UUID | ✅ After list/create project |
| `applicationId` | Both | Active application UUID | ✅ After submit/list |
| `notificationId` | Both | Unread notification UUID | ✅ After get notifications |
| `adminEmail` | Dev | Admin account email | No |
| `adminPassword` | Dev | Admin account password | No |
| `testEmail` | Dev | Test user email | No |
| `testPassword` | Dev | Test user password | No |

---

## Domain Overview

```
Senabil Platform
├── Auth          — Register, Login, Logout, Password Management
├── Users         — Profile, Password (self-service, authenticated)
├── Projects      — Humanitarian aid projects (CRUD by admin, browse by all)
├── Applications  — Users apply to projects; admins review
├── Notifications — System notifications triggered by key events
├── Dashboard     — Admin analytics: stats, users, audit trail
└── Public        — Unauthenticated stats and dev tools
```

---

## API Endpoints

### Authentication — `/api/auth`

#### POST /api/auth/register
Creates a new user account and returns a JWT token.

**Request Body:**
```json
{
  "firstName": "Ahmed",
  "lastName": "Hassan",
  "email": "ahmed@example.com",
  "password": "Password123",
  "phone": "059-1234567",
  "role": "BENEFICIARY",
  "birthDate": "1995-06-15",
  "governorate": "Gaza",
  "address": "Al-Rimal, Gaza City",
  "bio": "Looking for food assistance."
}
```

**Validation (Zod):**
- `firstName`, `lastName`: min 2 chars
- `email`: valid email format
- `password`: min 6 chars
- `phone`: min 6 chars
- `role`: enum `BENEFICIARY | VOLUNTEER | ADMIN`
- `birthDate`, `governorate`, `address`, `bio`: optional

**Success (201):**
```json
{
  "success": true,
  "message": "Registration successful! Welcome to Senabil.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "ahmed@example.com",
    "firstName": "Ahmed",
    "lastName": "Hassan",
    "phone": "059-1234567",
    "role": "BENEFICIARY",
    "governorate": "Gaza",
    "createdAt": "2026-01-15T10:00:00.000Z"
  }
}
```

**Side Effects:**
- Creates welcome in-app notification
- Sends welcome email
- Creates audit log entry `USER_REGISTERED`

**Errors:** `409` email already exists

---

#### POST /api/auth/login
Authenticates a user and returns a JWT token.

**Request Body:**
```json
{ "email": "ahmed@example.com", "password": "Password123" }
```

**Success (200):** Same shape as register response  
**Errors:** `401` invalid credentials

---

#### POST /api/auth/logout
Logs out the current user (optional auth — works with or without token).

**Success (200):** `{ "success": true, "message": "Logged out successfully." }`

---

#### POST /api/auth/forgot-password
Initiates password reset (email-based flow).

**Request Body:** `{ "email": "ahmed@example.com" }`  
**Success (200):** `{ "success": true, "message": "..." }`

---

#### POST /api/auth/reset-password
Completes password reset with a new password.

**Request Body:**
```json
{ "email": "ahmed@example.com", "newPassword": "NewPassword456" }
```
**Success (200):** `{ "success": true, "message": "Password reset successful." }`

---

### Users — `/api/users` (requireAuth)

#### GET /api/users/me
Returns the current user's profile with application and notification counts.

**Success (200):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "ahmed@example.com",
    "firstName": "Ahmed",
    "lastName": "Hassan",
    "phone": "059-1234567",
    "birthDate": "1995-06-15T00:00:00.000Z",
    "governorate": "Gaza",
    "address": "Al-Rimal, Gaza City",
    "bio": "...",
    "role": "BENEFICIARY",
    "createdAt": "...",
    "updatedAt": "...",
    "_count": {
      "applications": 3,
      "notifications": 2
    }
  }
}
```

---

#### PATCH /api/users/me
Updates profile fields (partial update — all fields optional).

**Updatable Fields:** `firstName`, `lastName`, `phone`, `birthDate`, `governorate`, `address`, `bio`  
> Note: `email` and `role` cannot be changed via this endpoint.

---

#### GET /api/users/me/applications
Returns all applications submitted by the current user, with project details.

---

#### PATCH /api/users/me/password
Changes account password.

**Request Body:**
```json
{ "currentPassword": "Password123", "newPassword": "NewPassword456" }
```
**Errors:** `400` current password incorrect

---

### Projects — `/api/projects`

#### GET /api/projects
Lists all projects. Supports filtering.

**Query Parameters:**
| Param | Type | Values |
|-------|------|--------|
| `search` | string | free-text on title and description |
| `status` | enum | `RUNNING` \| `PAUSED` \| `COMPLETED` |
| `category` | enum | `FOOD` \| `EDUCATION` \| `CLOTHING` \| `WATER` \| `SHELTER` \| `HEALTH` \| `ORPHAN_SUPPORT` \| `TRAINING` \| `ECONOMIC_SUPPORT` |

**Success (200):**
```json
{
  "success": true,
  "count": 12,
  "projects": [
    {
      "id": "uuid",
      "title": "Emergency Food Aid – Rafah",
      "slug": "emergency-food-aid-rafah",
      "shortDescription": "...",
      "category": "FOOD",
      "status": "RUNNING",
      "targetBeneficiaries": 500,
      "targetVolunteers": 20,
      "startDate": "2026-01-01T00:00:00.000Z",
      "endDate": "2026-12-31T00:00:00.000Z",
      "stats": {
        "totalApplications": 47,
        "beneficiaries": 38,
        "volunteers": 9
      }
    }
  ]
}
```

---

#### GET /api/projects/featured
Returns up to 6 most recent RUNNING projects.

---

#### GET /api/projects/:id (optional auth)
Returns a single project by UUID or slug. If authenticated as ADMIN, includes additional admin-only fields.

---

#### POST /api/projects (ADMIN)
Creates a new project. Slug is auto-generated from title if not provided.

**Required Fields:** `title`, `shortDescription`, `description`, `category`  
**Optional Fields:** `slug`, `objectives`, `eligibility`, `requirements`, `imageUrl`, `status` (default: RUNNING), `targetBeneficiaries`, `targetVolunteers`, `startDate`, `endDate`

---

#### PATCH /api/projects/:id (ADMIN)
Partially updates a project. All fields optional.

---

#### DELETE /api/projects/:id (ADMIN)
Permanently deletes a project and all its applications (cascade).

---

#### PATCH /api/projects/:id/status (ADMIN)
Updates only the project status.

**Request Body:** `{ "status": "PAUSED" }` — `RUNNING | PAUSED | COMPLETED`

---

#### GET /api/projects/:id/analytics (ADMIN)
Returns detailed application analytics for a project.

---

### Applications — `/api/applications`

#### POST /api/applications (requireAuth)
Submits a new application for a project.

**Request Body:**
```json
{
  "projectId": "uuid",
  "motivation": "Detailed motivation (min 10 chars)...",
  "notes": "Optional additional notes"
}
```

**Business Rules:**
- Cannot apply to a PAUSED or COMPLETED project
- One application per user per project (unique constraint)

**Side Effects:** Creates in-app notification + sends confirmation email + audit log

---

#### GET /api/applications/me (requireAuth)
Returns all applications by the current user with full project details.

---

#### GET /api/applications (ADMIN)
Returns all applications across all users and projects.

**Query Parameters:**
| Param | Values |
|-------|--------|
| `status` | `PENDING` \| `APPROVED` \| `REJECTED` |
| `projectId` | UUID |
| `role` | `BENEFICIARY` \| `VOLUNTEER` |

---

#### PATCH /api/applications/:id/review (ADMIN)
Approves or rejects an application.

**Request Body:**
```json
{
  "status": "APPROVED",
  "adminNotes": "Applicant meets all eligibility criteria."
}
```

**Side Effects:** Creates in-app notification + sends email + audit log `APPLICATION_REVIEWED`

---

### Notifications — `/api/notifications` (requireAuth)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/notifications` | Last 50 notifications + unread count |
| PATCH | `/api/notifications/:id/read` | Mark one as read |
| PATCH | `/api/notifications/read-all` | Mark all as read |

**Notification Types (auto-created):**
- `Welcome to Senabil!` — on register
- `Application Submitted` — on application create
- `Application APPROVED/REJECTED` — on admin review

---

### Admin Dashboard — `/api/dashboard` (ADMIN)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/dashboard/overview` | Stats, category breakdown, recent activity |
| GET | `/api/dashboard/projects` | All projects with application counts |
| GET | `/api/dashboard/beneficiaries` | All BENEFICIARY users |
| GET | `/api/dashboard/volunteers` | All VOLUNTEER users |
| GET | `/api/dashboard/applications` | All applications (filterable) |
| GET | `/api/dashboard/audit-logs` | System audit trail |

**Audit Log Query Params:** `action`, `search` (actor name/email), `limit` (default: 100)

---

### Public Endpoints — `/api/public`

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/public/stats` | None | Live platform statistics |
| GET | `/api/public/email-history` | None | Email dispatch log (dev tool) |

---

### Health Check

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/health` | Server health + timestamp |

---

## Business Workflows

### Workflow 1: User Registration
```
1. POST /api/auth/register
   → User created, JWT token returned
   → Welcome notification created
   → Welcome email sent
   → Audit log: USER_REGISTERED

2. GET /api/users/me
   → Verify profile data

3. GET /api/projects
   → Browse available projects
```

### Workflow 2: Application Submission
```
1. POST /api/auth/login
   → token saved to {{token}}

2. GET /api/projects?status=RUNNING
   → projectId saved to {{projectId}}

3. POST /api/applications
   Body: { projectId: {{projectId}}, motivation: "...", notes: "..." }
   → applicationId saved to {{applicationId}}
   → Status: PENDING
   → Notification + email sent

4. GET /api/notifications
   → Confirm submission notification received
```

### Workflow 3: Admin Review Workflow
```
1. POST /api/auth/login (ADMIN credentials)
   → token saved

2. GET /api/dashboard/overview
   → Check pendingApplications count

3. GET /api/applications?status=PENDING
   → applicationId saved

4. PATCH /api/applications/{{applicationId}}/review
   Body: { "status": "APPROVED", "adminNotes": "Approved." }
   → Applicant notified via notification + email
   → Audit log: APPLICATION_REVIEWED

5. GET /api/dashboard/audit-logs
   → Confirm audit trail entry
```

### Workflow 4: Project Lifecycle (Admin)
```
1. POST /api/projects          → Create (status: RUNNING)
2. PATCH /api/projects/:id     → Update details
3. GET /api/projects/:id/analytics → Monitor applications
4. PATCH /api/projects/:id/status  → Set to PAUSED or COMPLETED
5. DELETE /api/projects/:id    → Remove (cascades applications)
```

---

## Data Models

### User
```
id            UUID (PK)
email         String (unique)
passwordHash  String (bcrypt)
firstName     String
lastName      String
phone         String
birthDate     DateTime?
governorate   String?
address       String?
bio           String?
role          BENEFICIARY | VOLUNTEER | ADMIN
createdAt     DateTime
updatedAt     DateTime
```

### Project
```
id                  UUID (PK)
title               String
slug                String (unique, auto-generated)
shortDescription    String
description         String
objectives          String?
eligibility         String?
requirements        String?
imageUrl            String?
category            FOOD | EDUCATION | CLOTHING | WATER | SHELTER | HEALTH | ORPHAN_SUPPORT | TRAINING | ECONOMIC_SUPPORT
status              RUNNING | PAUSED | COMPLETED
targetBeneficiaries Int?
targetVolunteers    Int?
createdById         String?
updatedById         String?
startDate           DateTime?
endDate             DateTime?
createdAt           DateTime
updatedAt           DateTime
```

### Application
```
id          UUID (PK)
userId      String (FK → User)
projectId   String (FK → Project)
motivation  String
notes       String?
status      PENDING | APPROVED | REJECTED (default: PENDING)
reviewedBy  String?
reviewedAt  DateTime?
adminNotes  String?
createdAt   DateTime
UNIQUE(userId, projectId)
```

### Notification
```
id        UUID (PK)
userId    String (FK → User)
title     String
message   String
isRead    Boolean (default: false)
createdAt DateTime
```

### AuditLog
```
id          UUID (PK)
actorId     String (FK → User)
action      String (e.g., USER_REGISTERED, APPLICATION_REVIEWED)
entityType  String (e.g., User, Project, Application)
entityId    String
description String?
createdAt   DateTime
```

---

## Error Handling

All errors follow a consistent shape:

```json
{
  "success": false,
  "message": "Human-readable error message"
}
```

Validation errors include a field-level breakdown:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["Valid email address is required"],
    "password": ["Password must be at least 6 characters"]
  }
}
```

### HTTP Status Codes
| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Resource created |
| `400` | Bad request / validation error |
| `401` | Unauthorized — missing or invalid token |
| `403` | Forbidden — insufficient role |
| `404` | Resource not found |
| `409` | Conflict — duplicate record |
| `500` | Internal server error |

---

## Testing Guide

### Test Execution Order
For a complete integration test run, follow this sequence:

```
1. Health Check                          → verify server
2. Register (as BENEFICIARY)             → token auto-saved
3. Get My Profile                        → verify user data
4. List Projects                         → projectId auto-saved
5. Submit Application                    → applicationId auto-saved
6. Get Notifications                     → notificationId auto-saved
7. Mark Notification as Read             → verify isRead: true
8. Login (as ADMIN — update credentials)
9. Dashboard Overview                    → verify stats
10. List All Applications (status=PENDING)
11. Review Application (APPROVED)
12. Dashboard Audit Logs                 → verify APPLICATION_REVIEWED entry
```

### Collection Runner Tips
- Use the **development** environment
- Run the Authentication folder first to get a valid token
- Enable/disable query params on filter requests to test different scenarios
- Test 401 by clearing `{{token}}` in the environment

### Auth Error Tests
- Remove `{{token}}` → expect `401 Authentication required`
- Use a BENEFICIARY token on `/api/dashboard/overview` → expect `403 Access denied`
- Apply twice to same project → expect `409` conflict error
