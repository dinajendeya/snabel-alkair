import prisma from '../prisma';
import {
  CreateProjectInput,
  UpdateProjectInput,
  ProjectQueryInput,
  UpdateProjectStatusInput,
} from '../validators/project.schema';
import { AppError } from '../utils/appError';
import { auditLogService } from './auditLogService';
import { toDateOrNull } from '../utils/date';
import { ProjectCategory, ProjectStatus } from '@prisma/client';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export class ProjectService {
  async getProjects(query: ProjectQueryInput) {
    const whereClause: any = {};

    if (query.search) {
      whereClause.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { shortDescription: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.status) {
      whereClause.status = query.status as ProjectStatus;
    }

    if (query.category) {
      whereClause.category = query.category as ProjectCategory;
    }

    const projects = await prisma.project.findMany({
      where: whereClause,
      include: {
        applications: {
          select: {
            id: true,
            status: true,
            user: { select: { role: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const enriched = projects.map((p) => {
      const beneficiaries = p.applications.filter(
        (a) => a.status === 'APPROVED' && a.user.role === 'BENEFICIARY'
      ).length;
      const volunteers = p.applications.filter(
        (a) => a.status === 'APPROVED' && a.user.role === 'VOLUNTEER'
      ).length;
      const totalApplications = p.applications.length;

      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        shortDescription: p.shortDescription,
        description: p.description,
        objectives: p.objectives,
        eligibility: p.eligibility,
        requirements: p.requirements,
        imageUrl: p.imageUrl,
        category: p.category,
        status: p.status,
        targetBeneficiaries: p.targetBeneficiaries,
        targetVolunteers: p.targetVolunteers,
        startDate: p.startDate,
        endDate: p.endDate,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        stats: {
          totalApplications,
          beneficiaries,
          volunteers,
        },
      };
    });

    return {
      count: enriched.length,
      projects: enriched,
    };
  }

  async getFeaturedProjects() {
    const projects = await prisma.project.findMany({
      where: { status: 'RUNNING' },
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        applications: {
          select: {
            id: true,
            status: true,
            user: { select: { role: true } },
          },
        },
      },
    });

    const enriched = projects.map((p) => {
      const beneficiaries = p.applications.filter(
        (a) => a.status === 'APPROVED' && a.user.role === 'BENEFICIARY'
      ).length;
      const volunteers = p.applications.filter(
        (a) => a.status === 'APPROVED' && a.user.role === 'VOLUNTEER'
      ).length;
      const totalApplications = p.applications.length;

      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        shortDescription: p.shortDescription,
        description: p.description,
        objectives: p.objectives,
        eligibility: p.eligibility,
        requirements: p.requirements,
        imageUrl: p.imageUrl,
        category: p.category,
        status: p.status,
        targetBeneficiaries: p.targetBeneficiaries,
        targetVolunteers: p.targetVolunteers,
        startDate: p.startDate,
        endDate: p.endDate,
        stats: {
          totalApplications,
          beneficiaries,
          volunteers,
        },
      };
    });

    return { projects: enriched };
  }

  async getProjectById(idOrSlug: string, currentUserId?: string, isAdmin: boolean = false) {
    const project = await prisma.project.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        applications: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                role: true,
                governorate: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const totalApplications = project.applications.length;
    const pendingApplications = project.applications.filter((a) => a.status === 'PENDING').length;
    const approvedApplications = project.applications.filter((a) => a.status === 'APPROVED').length;
    const rejectedApplications = project.applications.filter((a) => a.status === 'REJECTED').length;

    const beneficiaries = project.applications.filter(
      (a) => a.status === 'APPROVED' && a.user.role === 'BENEFICIARY'
    ).length;
    const volunteers = project.applications.filter(
      (a) => a.status === 'APPROVED' && a.user.role === 'VOLUNTEER'
    ).length;

    let userApplication = null;
    if (currentUserId) {
      userApplication = project.applications.find((a) => a.userId === currentUserId) || null;
    }

    const sanitizedApplicants = isAdmin
      ? project.applications.map((a) => ({
          id: a.id,
          userId: a.userId,
          applicantName: `${a.user.firstName} ${a.user.lastName}`,
          applicantEmail: a.user.email,
          applicantPhone: a.user.phone,
          applicantRole: a.user.role,
          governorate: a.user.governorate,
          motivation: a.motivation,
          notes: a.notes,
          adminNotes: a.adminNotes,
          status: a.status,
          appliedAt: a.createdAt,
          reviewedAt: a.reviewedAt,
        }))
      : [];

    return {
      project: {
        id: project.id,
        title: project.title,
        slug: project.slug,
        shortDescription: project.shortDescription,
        description: project.description,
        objectives: project.objectives,
        eligibility: project.eligibility,
        requirements: project.requirements,
        imageUrl: project.imageUrl,
        category: project.category,
        status: project.status,
        targetBeneficiaries: project.targetBeneficiaries,
        targetVolunteers: project.targetVolunteers,
        startDate: project.startDate,
        endDate: project.endDate,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        stats: {
          totalApplications,
          pendingApplications,
          approvedApplications,
          rejectedApplications,
          beneficiaries,
          volunteers,
        },
        userApplication: userApplication
          ? {
              id: userApplication.id,
              status: userApplication.status,
              motivation: userApplication.motivation,
              appliedAt: userApplication.createdAt,
            }
          : null,
        applicants: sanitizedApplicants,
      },
    };
  }

  async createProject(input: CreateProjectInput, actorId?: string) {
    let baseSlug = input.slug ? slugify(input.slug) : slugify(input.title);
    if (!baseSlug) baseSlug = `project-${Date.now()}`;

    let uniqueSlug = baseSlug;
    let counter = 1;
    while (await prisma.project.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${counter++}`;
    }

    const project = await prisma.project.create({
      data: {
        title: input.title,
        slug: uniqueSlug,
        shortDescription: input.shortDescription,
        description: input.description,
        objectives: input.objectives || null,
        eligibility: input.eligibility || null,
        requirements: input.requirements || null,
        imageUrl: input.imageUrl || null,
        category: input.category as ProjectCategory,
        status: (input.status as ProjectStatus) || 'RUNNING',
        targetBeneficiaries: input.targetBeneficiaries || null,
        targetVolunteers: input.targetVolunteers || null,
        startDate: toDateOrNull(input.startDate),
        endDate: toDateOrNull(input.endDate),
        createdById: actorId || null,
      },
    });

    if (actorId) {
      await auditLogService.log({
        actorId,
        action: 'PROJECT_CREATED',
        entityType: 'Project',
        entityId: project.id,
        description: `Project created: "${project.title}" (${project.category}) with status ${project.status}`,
      });
    }

    return { project };
  }

  async updateProject(id: string, input: UpdateProjectInput, actorId?: string) {
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Project not found', 404);
    }

    let slug = existing.slug;
    if (input.slug && input.slug !== existing.slug) {
      slug = slugify(input.slug);
      const conflict = await prisma.project.findFirst({
        where: { slug, NOT: { id } },
      });
      if (conflict) slug = `${slug}-${Date.now()}`;
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        ...(input.title ? { title: input.title } : {}),
        slug,
        ...(input.shortDescription ? { shortDescription: input.shortDescription } : {}),
        ...(input.description ? { description: input.description } : {}),
        ...(input.objectives !== undefined ? { objectives: input.objectives } : {}),
        ...(input.eligibility !== undefined ? { eligibility: input.eligibility } : {}),
        ...(input.requirements !== undefined ? { requirements: input.requirements } : {}),
        ...(input.imageUrl !== undefined ? { imageUrl: input.imageUrl } : {}),
        ...(input.category ? { category: input.category as ProjectCategory } : {}),
        ...(input.status ? { status: input.status as ProjectStatus } : {}),
        ...(input.targetBeneficiaries !== undefined ? { targetBeneficiaries: input.targetBeneficiaries } : {}),
        ...(input.targetVolunteers !== undefined ? { targetVolunteers: input.targetVolunteers } : {}),
        ...(input.startDate !== undefined ? { startDate: toDateOrNull(input.startDate) } : {}),
        ...(input.endDate !== undefined ? { endDate: toDateOrNull(input.endDate) } : {}),
        updatedById: actorId || null,
      },
    });

    if (actorId) {
      await auditLogService.log({
        actorId,
        action: 'PROJECT_UPDATED',
        entityType: 'Project',
        entityId: updated.id,
        description: `Project updated: "${updated.title}"`,
      });
    }

    return { project: updated };
  }

  async updateProjectStatus(id: string, input: UpdateProjectStatusInput, actorId?: string) {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        status: input.status as ProjectStatus,
        updatedById: actorId || null,
      },
    });

    let action = 'PROJECT_UPDATED';
    if (input.status === 'PAUSED') action = 'PROJECT_PAUSED';
    else if (input.status === 'RUNNING') action = 'PROJECT_RESUMED';
    else if (input.status === 'COMPLETED') action = 'PROJECT_COMPLETED';

    if (actorId) {
      await auditLogService.log({
        actorId,
        action,
        entityType: 'Project',
        entityId: updated.id,
        description: `Project status changed from ${project.status} to ${input.status} for "${project.title}"`,
      });
    }

    return { project: updated };
  }

  async deleteProject(id: string, actorId?: string) {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      throw new AppError('Project not found', 404);
    }

    await prisma.project.delete({ where: { id } });

    if (actorId) {
      await auditLogService.log({
        actorId,
        action: 'PROJECT_DELETED',
        entityType: 'Project',
        entityId: id,
        description: `Project deleted: "${project.title}"`,
      });
    }

    return { message: 'Project deleted successfully.' };
  }

  async getProjectAnalytics(id: string) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        applications: {
          include: {
            user: {
              select: {
                role: true,
                governorate: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const total = project.applications.length;
    const pending = project.applications.filter((a) => a.status === 'PENDING').length;
    const approved = project.applications.filter((a) => a.status === 'APPROVED').length;
    const rejected = project.applications.filter((a) => a.status === 'REJECTED').length;

    const beneficiaries = project.applications.filter(
      (a) => a.status === 'APPROVED' && a.user.role === 'BENEFICIARY'
    ).length;
    const volunteers = project.applications.filter(
      (a) => a.status === 'APPROVED' && a.user.role === 'VOLUNTEER'
    ).length;

    const governorateBreakdown: Record<string, number> = {};
    project.applications.forEach((a) => {
      const gov = a.user.governorate || 'Unspecified';
      governorateBreakdown[gov] = (governorateBreakdown[gov] || 0) + 1;
    });

    return {
      analytics: {
        projectId: project.id,
        projectTitle: project.title,
        status: project.status,
        targets: {
          beneficiariesGoal: project.targetBeneficiaries || 0,
          volunteersGoal: project.targetVolunteers || 0,
        },
        achieved: {
          beneficiaries,
          volunteers,
          beneficiaryProgressPct: project.targetBeneficiaries
            ? Math.min(100, Math.round((beneficiaries / project.targetBeneficiaries) * 100))
            : 100,
          volunteerProgressPct: project.targetVolunteers
            ? Math.min(100, Math.round((volunteers / project.targetVolunteers) * 100))
            : 100,
        },
        applications: {
          total,
          pending,
          approved,
          rejected,
        },
        governorateBreakdown,
      },
    };
  }
}

export const projectService = new ProjectService();

