import prisma from '../prisma';
import { auditLogService, AuditLogQueryParams } from './auditLogService';

export class DashboardService {
  async getOverview() {
    const [
      totalProjects,
      runningProjects,
      pausedProjects,
      completedProjects,
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
      totalBeneficiaries,
      totalVolunteers,
      recentAuditLogs,
      recentApplications,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { status: 'RUNNING' } }),
      prisma.project.count({ where: { status: 'PAUSED' } }),
      prisma.project.count({ where: { status: 'COMPLETED' } }),
      prisma.application.count(),
      prisma.application.count({ where: { status: 'PENDING' } }),
      prisma.application.count({ where: { status: 'APPROVED' } }),
      prisma.application.count({ where: { status: 'REJECTED' } }),
      prisma.user.count({ where: { role: 'BENEFICIARY' } }),
      prisma.user.count({ where: { role: 'VOLUNTEER' } }),
      prisma.auditLog.findMany({
        take: 8,
        orderBy: { createdAt: 'desc' },
        include: {
          actor: {
            select: { firstName: true, lastName: true, email: true, role: true },
          },
        },
      }),
      prisma.application.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { firstName: true, lastName: true, email: true, role: true },
          },
          project: {
            select: { title: true, category: true },
          },
        },
      }),
    ]);

    const categoryCounts = await prisma.project.groupBy({
      by: ['category'],
      _count: { id: true },
    });

    return {
      stats: {
        totalProjects,
        runningProjects,
        pausedProjects,
        completedProjects,
        totalApplications,
        pendingApplications,
        approvedApplications,
        rejectedApplications,
        totalBeneficiaries,
        totalVolunteers,
      },
      categoryCounts: categoryCounts.map((c) => ({
        category: c.category,
        count: c._count.id,
      })),
      recentAuditLogs,
      recentApplications,
    };
  }

  async getDashboardProjects() {
    const projects = await prisma.project.findMany({
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
      const pendingApplications = p.applications.filter((a) => a.status === 'PENDING').length;

      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        category: p.category,
        status: p.status,
        shortDescription: p.shortDescription,
        description: p.description,
        objectives: p.objectives,
        eligibility: p.eligibility,
        requirements: p.requirements,
        imageUrl: p.imageUrl,
        targetBeneficiaries: p.targetBeneficiaries,
        targetVolunteers: p.targetVolunteers,
        startDate: p.startDate,
        endDate: p.endDate,
        createdAt: p.createdAt,
        totalApplications,
        pendingApplications,
        beneficiaries,
        volunteers,
      };
    });

    return { projects: enriched };
  }

  async getBeneficiaries() {
    const beneficiaries = await prisma.user.findMany({
      where: { role: 'BENEFICIARY' },
      include: {
        applications: {
          include: {
            project: {
              select: { id: true, title: true, category: true, status: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const result = beneficiaries.map((u) => {
      const approvedCount = u.applications.filter((a) => a.status === 'APPROVED').length;
      const pendingCount = u.applications.filter((a) => a.status === 'PENDING').length;

      return {
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        name: `${u.firstName} ${u.lastName}`,
        email: u.email,
        phone: u.phone,
        governorate: u.governorate,
        address: u.address,
        bio: u.bio,
        birthDate: u.birthDate,
        createdAt: u.createdAt,
        totalApplications: u.applications.length,
        approvedProjects: approvedCount,
        pendingApplications: pendingCount,
        status: approvedCount > 0 ? 'ACTIVE_BENEFICIARY' : pendingCount > 0 ? 'PENDING_REVIEW' : 'REGISTERED',
        applications: u.applications,
      };
    });

    return { beneficiaries: result };
  }

  async getVolunteers() {
    const volunteers = await prisma.user.findMany({
      where: { role: 'VOLUNTEER' },
      include: {
        applications: {
          include: {
            project: {
              select: { id: true, title: true, category: true, status: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const result = volunteers.map((u) => {
      const approvedCount = u.applications.filter((a) => a.status === 'APPROVED').length;
      const pendingCount = u.applications.filter((a) => a.status === 'PENDING').length;

      return {
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        name: `${u.firstName} ${u.lastName}`,
        email: u.email,
        phone: u.phone,
        governorate: u.governorate,
        address: u.address,
        bio: u.bio,
        birthDate: u.birthDate,
        createdAt: u.createdAt,
        totalApplications: u.applications.length,
        approvedProjects: approvedCount,
        pendingApplications: pendingCount,
        status: approvedCount > 0 ? 'ACTIVE_VOLUNTEER' : pendingCount > 0 ? 'PENDING_REVIEW' : 'REGISTERED',
        applications: u.applications,
      };
    });

    return { volunteers: result };
  }

  async getAuditLogs(params: AuditLogQueryParams) {
    return auditLogService.getLogs(params);
  }

  async getLiveStats() {
    const [
      totalProjects,
      totalBeneficiaries,
      totalVolunteers,
      totalApprovedApplications,
      totalRunningProjects,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.user.count({ where: { role: 'BENEFICIARY' } }),
      prisma.user.count({ where: { role: 'VOLUNTEER' } }),
      prisma.application.count({ where: { status: 'APPROVED' } }),
      prisma.project.count({ where: { status: 'RUNNING' } }),
    ]);

    const distinctGovernorates = await prisma.user.findMany({
      where: {
        governorate: { not: null },
        applications: {
          some: { status: 'APPROVED' },
        },
      },
      select: { governorate: true },
      distinct: ['governorate'],
    });

    const communitiesServed = Math.max(5, distinctGovernorates.length || 5);

    return {
      stats: {
        totalProjects,
        totalBeneficiaries,
        totalVolunteers,
        communitiesServed,
        totalApprovedApplications,
        totalRunningProjects,
      },
    };
  }
}

export const dashboardService = new DashboardService();

