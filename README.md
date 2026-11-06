# 🌿 Senabil Community Impact Platform
### Full-Stack Humanitarian Aid & Volunteer Management Platform for Gaza Relief NGOs

---

## 📖 Project Overview

**Senabil Community Impact Platform** is a full-stack humanitarian aid management solution tailored for NGOs and non-profit organizations operating in crisis zones and vulnerable communities across the Gaza Strip.

The platform streamlines:
- **Beneficiary Management**: Secure intake and dignified tracking of displaced families in need of food, water, winter aid, shelter, orphan care, and healthcare.
- **Volunteer Mobilization**: Registration and deployment of educators, engineers, medics, and field logistics volunteers.
- **Project Lifecycle Management**: Full control over publishing, pausing, resuming, completing, and auditing humanitarian projects.
- **Project Enrollment & Review Workflows**: Automated application submission, email dispatch, notification generation, and audit logging.
- **Administrative Command Center**: Comprehensive metrics, project drawers, applicant review with approval/rejection notes, and immutable audit logs.
- **Real-Time Dynamic Statistics**: Live counters calculated directly from verified database records (no static statistics table).

---

## 🏗️ Technology Stack

- **Backend**: Node.js, Express, TypeScript
- **Database & ORM**: PostgreSQL, Prisma ORM
- **Authentication**: JWT, bcryptjs, Role-Based Access Control (RBAC)
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **Event-Driven Workflows**: Automatic welcome notifications, email generation & tracking, and audit trail logging on every business event.

---

## 👥 Three Core User Roles

| Role | Description | Examples |
|---|---|---|
| **BENEFICIARY** | Individuals and families seeking humanitarian support | Food Support, Education Support, Winter Aid, Water Support, Shelter, Orphan Care, Medical Assistance |
| **VOLUNTEER** | Community members contributing professional skills or time | Teacher, Software Developer, Field Logistics, Social Worker, Translator, Medic |
| **ADMIN** | Full organizational and system governance | Manage Users, Manage Projects, Review Applications, Approve/Reject, Audit Logs, Real-Time Analytics |

---

## 🚀 Unified Registration & Application Flow

```
Authentication Gateway (/auth)
      ↓
Login OR Register (/choose-role)
      ↓
Select Role (Beneficiary or Volunteer)
      ↓
Registration Form (/register)
      ↓
Create User in PostgreSQL
      ↓
Create Welcome In-App Notification
      ↓
Generate Welcome Email
      ↓
Create Immutable Audit Log (USER_REGISTERED)
      ↓
Auto-Login (JWT Token Issued)
      ↓
Return Automatically to Destination (e.g. Project Application Form)
```

### Application Submission & Review Flow:
```
User Submits Application
      ↓
Validate Request (Must be RUNNING, Single Active Application per Project)
      ↓
Create Application (PENDING)
      ↓
Create Notification & Dispatch Confirmation Email
      ↓
Create Audit Log (APPLICATION_SUBMITTED)
      ↓
Appears in Admin Dashboard (/admin)
      ↓
Admin Reviews Application (Approve / Reject + Committee Notes)
      ↓
Update Application Status & User Profile Status
      ↓
Dispatch Decision Email & In-App Notification (APPLICATION_APPROVED / APPLICATION_REJECTED)
      ↓
Create Audit Log (APPLICATION_APPROVED / APPLICATION_REJECTED)
```

---

## 🔑 Default Test Accounts (Pre-Seeded)

| Role | Email | Password | Details |
|---|---|---|---|
| **👑 Admin** | `admin@senabil.org` | `admin123` | Executive Director of Humanitarian Operations |
| **🤝 Volunteer** | `tariq.volunteer@senabil.org` | `volunteer123` | STEM Educator in camp learning tents (Gaza City) |
| **🤝 Volunteer** | `nour.volunteer@senabil.org` | `volunteer123` | Software Developer mentoring youth (Khan Younis) |
| **🤲 Beneficiary** | `ahmed.beneficiary@gmail.com` | `beneficiary123` | Displaced family head (Deir al-Balah) |
| **🤲 Beneficiary** | `fatima.beneficiary@gmail.com` | `beneficiary123` | Caregiver of four orphaned children (Jabalia) |

*(Note: The login screen also features 1-click demo buttons to automatically populate any of these test credentials!)*

---

## 📡 API Endpoints Reference

### 1. Authentication
- `POST /api/auth/register` - Register new Beneficiary or Volunteer
- `POST /api/auth/login` - Authenticate user & issue JWT
- `POST /api/auth/logout` - Invalidate session & log audit event
- `POST /api/auth/forgot-password` - Request password recovery
- `POST /api/auth/reset-password` - Update password

### 2. User Profile
- `GET /api/users/me` - Current authenticated profile
- `PATCH /api/users/me` - Update profile information
- `GET /api/users/me/applications` - List applications submitted by current user
- `PATCH /api/users/me/password` - Change account password

### 3. Projects
- `GET /api/projects` - Filter projects by search, category, or status
- `GET /api/projects/featured` - Latest running projects for homepage
- `GET /api/projects/:id` - Project details, objectives, criteria & live stats
- `POST /api/projects` - Admin: Create new project
- `PATCH /api/projects/:id` - Admin: Edit project specifications
- `DELETE /api/projects/:id` - Admin: Remove project
- `PATCH /api/projects/:id/status` - Admin: Pause, Resume, or Complete project
- `GET /api/projects/:id/analytics` - Admin: Detailed demographic breakdown

### 4. Applications
- `POST /api/applications` - Submit application with motivation statement
- `GET /api/applications/me` - Current user's application history
- `GET /api/applications` - Admin: Filtered list of applications
- `PATCH /api/applications/:id/review` - Admin: Approve or Reject application

### 5. Notifications
- `GET /api/notifications` - Fetch user's in-app notifications
- `PATCH /api/notifications/:id/read` - Mark single notification as read
- `PATCH /api/notifications/read-all` - Mark all notifications as read

### 6. Admin Dashboard
- `GET /api/dashboard/overview` - Aggregate live stats, categories & recent events
- `GET /api/dashboard/projects` - Projects table with beneficiary & volunteer counts
- `GET /api/dashboard/beneficiaries` - Beneficiary roster & enrollment history
- `GET /api/dashboard/volunteers` - Volunteer roster & deployment history
- `GET /api/dashboard/applications` - Applications review table
- `GET /api/dashboard/audit-logs` - Immutable system audit logs

### 7. Public & Transparency
- `GET /api/public/stats` - Live database-calculated metrics
- `GET /api/public/email-history` - Email dispatch log for verification

---

## 🛠️ How to Run Locally

### 1. Database Setup
Ensure PostgreSQL is running locally on port `5432` with database `senabil_db`:
```bash
# In server/
npx prisma db push
npx prisma db seed
```

### 2. Start the Backend API
```bash
cd server
npm run dev
# Server starts on http://localhost:5000
```

### 3. Start the Frontend Application
```bash
cd client
npm run dev
# Client starts on http://localhost:5173
```
