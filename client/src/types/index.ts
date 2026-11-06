export type UserRole = 'BENEFICIARY' | 'VOLUNTEER' | 'ADMIN';

export type ProjectStatus = 'RUNNING' | 'PAUSED' | 'COMPLETED';

export type ProjectCategory =
  | 'FOOD'
  | 'EDUCATION'
  | 'CLOTHING'
  | 'WATER'
  | 'SHELTER'
  | 'HEALTH'
  | 'ORPHAN_SUPPORT'
  | 'TRAINING'
  | 'ECONOMIC_SUPPORT';

export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  birthDate?: string | null;
  governorate?: string | null;
  address?: string | null;
  bio?: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt?: string;
  _count?: {
    applications: number;
    notifications: number;
  };
}

export interface ProjectStats {
  totalApplications: number;
  pendingApplications?: number;
  approvedApplications?: number;
  rejectedApplications?: number;
  beneficiaries: number;
  volunteers: number;
}

export interface ProjectApplicant {
  id: string;
  userId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  applicantRole: UserRole;
  governorate?: string | null;
  motivation: string;
  notes?: string | null;
  adminNotes?: string | null;
  status: ApplicationStatus;
  appliedAt: string;
  reviewedAt?: string | null;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  objectives?: string | null;
  eligibility?: string | null;
  requirements?: string | null;
  imageUrl?: string | null;
  category: ProjectCategory;
  status: ProjectStatus;
  targetBeneficiaries?: number | null;
  targetVolunteers?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
  updatedAt: string;
  stats?: ProjectStats;
  totalApplications?: number;
  pendingApplications?: number;
  beneficiaries?: number;
  volunteers?: number;
  userApplication?: {
    id: string;
    status: ApplicationStatus;
    motivation: string;
    appliedAt: string;
  } | null;
  applicants?: ProjectApplicant[];
}

export interface Application {
  id: string;
  userId: string;
  projectId: string;
  motivation: string;
  notes?: string | null;
  status: ApplicationStatus;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  adminNotes?: string | null;
  createdAt: string;
  user?: User;
  project?: Project;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  description?: string;
  createdAt: string;
  actor: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
  };
}

export interface LiveStats {
  totalProjects: number;
  totalBeneficiaries: number;
  totalVolunteers: number;
  communitiesServed: number;
  totalApprovedApplications: number;
  totalRunningProjects: number;
}
