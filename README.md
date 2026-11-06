# 🌱 Senabil Community Impact Platform

A full-stack humanitarian aid management platform designed for NGOs and nonprofit organizations to manage beneficiaries, volunteers, projects, applications, notifications, reporting, and operational workflows.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [User Roles](#user-roles)
- [Core Workflows](#core-workflows)
- [Backend Structure](#backend-structure)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Security Features](#security-features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running The Application](#running-the-application)
- [Future Improvements](#future-improvements)

---

# Overview

Senabil Community Impact Platform is a comprehensive NGO management system that enables organizations to digitize humanitarian operations and improve transparency, accountability, and reporting.

The platform allows organizations to:

- Manage beneficiaries
- Manage volunteers
- Publish projects
- Accept applications
- Review and approve/reject applications
- Send automated notifications
- Track project participation
- Generate statistics and reports
- Maintain audit logs
- Manage activities through a centralized admin dashboard

---

# Features

## Public Features

- Homepage
- Projects Directory
- Project Details
- Registration & Authentication
- Profile Management

## Beneficiary Features

- Browse projects
- Apply for assistance programs
- Track application status
- Receive notifications
- Manage profile

## Volunteer Features

- Browse volunteer opportunities
- Apply to projects
- Track participation
- Receive notifications
- Manage profile

## Admin Features

- Manage projects
- Manage beneficiaries
- Manage volunteers
- Review applications
- Approve/reject submissions
- View analytics
- View audit logs
- Manage notifications

---

# Technology Stack

## Frontend

```text
React
TypeScript
React Router
Axios
React Context API
Tailwind CSS
```

### Frontend Architecture

```text
Component-Based Architecture
+
Page-Based Routing
+
React Context State Management
```

---

## Backend

```text
Node.js
Express.js
TypeScript
Prisma ORM
PostgreSQL
JWT Authentication
Zod Validation
```

### Backend Architecture

```text
MVC + Service Layer
```

Application flow:

```text
HTTP Request
      ↓
Route
      ↓
Controller
      ↓
Service
      ↓
Prisma ORM
      ↓
PostgreSQL
```

---

## Database

```text
PostgreSQL
```

Managed using:

```text
Prisma ORM
```

---

# System Architecture

## Backend Architecture

The backend follows a layered architecture pattern.

### Route Layer

Responsible for:

- Defining API endpoints
- Applying middleware
- Delegating requests to controllers

### Controller Layer

Responsible for:

- Reading request data
- Reading route parameters
- Returning HTTP responses
- Calling services

### Service Layer

Responsible for:

- Business logic
- Workflow orchestration
- Notifications
- Audit logging
- Project processing

### Prisma Layer

Responsible for:

- Database queries
- ORM mapping
- Data persistence

### PostgreSQL

Responsible for:

- Permanent data storage

---

# User Roles

## Beneficiary

A person seeking support.

Examples:

```text
Food Support
Water Support
Winter Aid
Education Support
Housing Assistance
Medical Support
```

Permissions:

```text
Register
Login
Apply To Projects
Receive Notifications
Track Applications
Manage Profile
```

---

## Volunteer

A person willing to contribute.

Examples:

```text
Teacher
Trainer
Developer
Translator
Social Worker
Field Volunteer
```

Permissions:

```text
Register
Login
Browse Projects
Apply To Volunteer Opportunities
Receive Notifications
Manage Profile
```

---

## Admin

System administrator.

Permissions:

```text
Manage Projects
Manage Applications
Manage Users
Manage Volunteers
Manage Beneficiaries
Review Applications
Access Analytics
Access Reports
Access Audit Logs
```

---

# Core Workflows

## Registration Workflow

```text
Registration
↓
Create User
↓
Create Welcome Notification
↓
Create Audit Log
↓
Auto Login
```

---

## Project Application Workflow

```text
User Applies
↓
Validate Request
↓
Create Application
↓
Create Notification
↓
Send Confirmation Email
↓
Create Audit Log
↓
Appear In Dashboard
```

---

## Application Review Workflow

```text
Admin Reviews Application
↓
Approve / Reject
↓
Update Status
↓
Create Notification
↓
Send Email
↓
Create Audit Log
```

---

# Backend Structure

```text
server/
│
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
│
├── src/
│
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   ├── middleware/
│   ├── validatorsa

## UserRole

```prisma
enum UserRole {
  BENEFICIARY
  VOLUNTEER
  ADMIN
}
```

## ProjectStatus

```prisma
enum ProjectStatus {
  RUNNING
  PAUSED
  COMPLETED
}
```

## ApplicationStatus

```prisma
enum ApplicationStatus {
  PENDING
  APPROVED
  REJECTED
}
```

## ProjectCategory

```prisma
enum ProjectCategory {
  FOOD
  EDUCATION
  CLOTHING
  WATER
  SHELTER
  HEALTH
  ORPHAN_SUPPORT
  TRAINING
  ECONOMIC_SUPPORT
}
```

### Core Models

- User
- Project
- Application
- Notification
- AuditLog

---
# Database Schema

## Enums

### User Roles

```prisma
enum UserRole {
  BENEFICIARY
  VOLUNTEER
  ADMIN
}
```

### Project Status

```prisma
enum ProjectStatus {
  RUNNING
  PAUSED
  COMPLETED
}
```

### Application Status

```prisma
enum ApplicationStatus {
  PENDING
  APPROVED
  REJECTED
}
```

### Project Categories

```prisma
enum ProjectCategory {
  FOOD
  EDUCATION
  CLOTHING
  WATER
  SHELTER
  HEALTH
  ORPHAN_SUPPORT
  TRAINING
  ECONOMIC_SUPPORT
}
```

---

## User

Stores all platform users including Beneficiaries, Volunteers, and Administrators.

```prisma
model User {
  id             String @id @default(uuid())

  email          String @unique
  passwordHash   String

  firstName      String
  lastName       String

  phone          String

  birthDate      DateTime?
  governorate    String?
  address        String?
  bio            String?

  role           UserRole

  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  applications   Application[]
  notifications  Notification[]
  auditLogs      AuditLog[]
}
```

---

## Project

Stores all NGO initiatives and humanitarian projects.

```prisma
model Project {
  id                  String @id @default(uuid())

  title               String
  slug                String @unique

  shortDescription    String
  description         String

  objectives          String?
  eligibility         String?
  requirements        String?

  imageUrl            String?

  category            ProjectCategory
  status              ProjectStatus

  targetBeneficiaries Int?
  targetVolunteers    Int?

  createdById         String?
  updatedById         String?

  startDate           DateTime?
  endDate             DateTime?

  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  applications        Application[]
}
```

---

## Application

Represents project applications submitted by beneficiaries or volunteers.

```prisma
model Application {
  id            String @id @default(uuid())

  userId        String
  projectId     String

  motivation    String
  notes         String?

  status        ApplicationStatus @default(PENDING)

  reviewedBy    String?
  reviewedAt    DateTime?

  adminNotes    String?

  createdAt     DateTime @default(now())

  user          User @relation(
                    fields: [userId],
                    references: [id]
                  )

  project       Project @relation(
                    fields: [projectId],
                    references: [id]
                  )

  @@unique([userId, projectId])
}
```

### Business Rules

```text
One user can apply only once per project.

Application statuses:
- PENDING
- APPROVED
- REJECTED
```

---

## Notification

Stores both system-generated and workflow-generated notifications.

```prisma
model Notification {
  id          String @id @default(uuid())

  userId      String

  title       String
  message     String

  isRead      Boolean @default(false)

  createdAt   DateTime @default(now())

  user User @relation(
    fields: [userId],
    references: [id]
  )
}
```

### Example Notifications

```text
Welcome To Senabil

Application Submitted

Application Approved

Application Rejected

New Project Available
```

---

## AuditLog

Records important actions performed in the system for transparency and accountability.

```prisma
model AuditLog {
  id            String @id @default(uuid())

  actorId       String

  action        String

  entityType    String
  entityId      String

  description   String?

  createdAt     DateTime @default(now())

  actor User @relation(
    fields: [actorId],
    references: [id]
  )
}
```

### Example Audit Events

```text
USER_REGISTERED

PROJECT_CREATED

PROJECT_UPDATED

PROJECT_PAUSED

PROJECT_RESUMED

PROJECT_COMPLETED

PROJECT_DELETED

APPLICATION_SUBMITTED

APPLICATION_APPROVED

APPLICATION_REJECTED

PASSWORD_RESET
```

---

# Entity Relationships

```text
User
 │
 ├── Applications (1:N)
 │
 ├── Notifications (1:N)
 │
 └── Audit Logs (1:N)

Project
 │
 └── Applications (1:N)

Application
 │
 ├── Belongs To User
 │
 └── Belongs To Project

Notification
 │
 └── Belongs To User

AuditLog
 │
 └── Belongs To User (Actor)
```

---

# ERD Overview

```text
┌──────────────┐
│     User     │
└──────┬───────┘
       │
       │ 1
       │
       ▼
┌──────────────┐
│ Application  │
└──────┬───────┘
       │
       │ N
       │
       ▼
┌──────────────┐
│   Project    │
└──────────────┘


┌──────────────┐
│     User     │
└──────┬───────┘
       │
       │ 1:N
       ▼
┌──────────────┐
│ Notification │
└──────────────┘


┌──────────────┐
│     User     │
└──────┬───────┘
       │
       │ 1:N
       ▼
┌──────────────┐
│   AuditLog   │
└──────────────┘
```

--

# API Endpoints

## Authentication

```http
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
```

---

## User

```http
GET    /api/users/me
PATCH  /api/users/me
GET    /api/users/me/applications
```

---

## Projects

```http
GET    /api/projects
GET    /api/projects/featured
GET    /api/projects/:id

POST   /api/projects
PATCH  /api/projects/:id
DELETE /api/projects/:id

PATCH  /api/projects/:id/status

GET    /api/projects/:id/analytics
```

---

## Applications

```http
POST   /api/applications

GET    /api/applications/me

GET    /api/applications

PATCH  /api/applications/:id/review
```

---

## Notifications

```http
GET    /api/notifications

PATCH  /api/notifications/:id/read

PATCH  /api/notifications/read-all
```

---

## Dashboard

```http
GET /api/dashboard/overview

GET /api/dashboard/projects

GET /api/dashboard/beneficiaries

GET /api/dashboard/volunteers

GET /api/dashboard/applications

GET /api/dashboard/audit-logs
```

---

# Security Features

Implemented security mechanisms:

```text
JWT Authentication

Role-Based Access Control (RBAC)

bcrypt Password Hashing

Protected Routes

Zod Validation

Centralized Error Handling

Authentication Middleware

Authorization Middleware

Prisma Type Safety
```

---

# Getting Started

## Clone The Repository

```bash
git clone https://github.com/yourusername/senabil-community-impact-platform.git

cd senabil-community-impact-platform
```

---

# Environment Variables

## Backend (.env)

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/senabil_db"

JWT_SECRET="your-secret-key"

PORT=5000

EMAIL_USER="your-email@gmail.com"

EMAIL_PASS="your-app-password"
```

---

## Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

---

# Database Setup

Generate Prisma client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate dev
```

Seed database:

```bash
npx ts-node prisma/seed.ts
```

Open Prisma Studio:

```bash
npx prisma studio
```

---

# Running The Application

## Backend

```bash
cd server

npm install

npm run dev
```

Backend URL:

```text
http://localhost:5000
```

---

## Frontend

```bash
cd client

npm install

npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

# Design Principles

The project follows:

```text
MVC + Service Layer Architecture

Component-Based React Architecture

RESTful API Design

Role-Based Authorization

Reusable Components

Centralized Business Logic

Centralized Error Handling

Scalable Database Design
```

---

# Future Improvements

```text
File Uploads

Advanced Analytics

PDF Reports

Project Media Gallery

Multi-Language Support

SMS Notifications

Advanced Role Permissions

Project Impact Reports

Data Export Features
```


