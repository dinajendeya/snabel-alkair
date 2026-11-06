import prisma from '../prisma';
import { CreateApplicationInput, ReviewApplicationInput, ApplicationQueryInput } from '../validators/application.schema';
import { AppError } from '../utils/appError';
import { auditLogService } from './auditLogService';
import { emailService } from './emailService';
import { notificationService } from './notificationService';
import { ApplicationStatus, UserRole } from '@prisma/client';

export class ApplicationService {
  async createApplication(userId: string, input: CreateApplicationInput) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const project = await prisma.project.findUnique({
      where: { id: input.projectId },
    });

    if (!project) {
      throw new AppError('Project not found.', 404);
    }

    if (project.status === 'PAUSED') {
      throw new AppError('This project is currently paused.', 400);
    }

    if (project.status === 'COMPLETED') {
      throw new AppError('This project has been completed.', 400);
    }

    const existing = await prisma.application.findUnique({
      where: {
        userId_projectId: {
          userId,
          projectId: project.id,
        },
      },
    });

    if (existing) {
      throw new AppError(`You have already applied to this project (Status: ${existing.status}).`, 409);
    }

    // Create Application
    const application = await prisma.application.create({
      data: {
        userId,
        projectId: project.id,
        motivation: input.motivation.trim(),
        notes: input.notes?.trim() || null,
        status: 'PENDING',
      },
      include: {
        project: {
          select: { title: true, category: true, slug: true },
        },
      },
    });

    // Create In-App Notification
    await notificationService.createNotification({
      userId,
      title: 'Application Submitted',
      message: `Your application for "${project.title}" was submitted successfully. Our team will review it shortly.`,
    });

    // Send Confirmation Email
    const emailObj = emailService.generateApplicationSubmittedEmail(
      `${user.firstName} ${user.lastName}`,
      project.title
    );
    emailObj.to = user.email;
    await emailService.send(emailObj);

    // Create Audit Log
    await auditLogService.log({
      actorId: userId,
      action: 'APPLICATION_SUBMITTED',
      entityType: 'Application',
      entityId: application.id,
      description: `User ${user.email} (${user.role}) applied to project "${project.title}"`,
    });

    return { application };
  }

  async getMyApplications(userId: string) {
    const applications = await prisma.application.findMany({
      where: { userId },
      include: {
        project: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return { applications };
  }

  async getAllApplications(query: ApplicationQueryInput) {
    const whereClause: any = {};

    if (query.status) {
      whereClause.status = query.status as ApplicationStatus;
    }

    if (query.projectId) {
      whereClause.projectId = query.projectId;
    }

    if (query.role) {
      whereClause.user = { role: query.role as UserRole };
    }

    const applications = await prisma.application.findMany({
      where: whereClause,
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
            address: true,
            bio: true,
            birthDate: true,
            createdAt: true,
          },
        },
        project: {
          select: {
            id: true,
            title: true,
            slug: true,
            category: true,
            status: true,
            imageUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      count: applications.length,
      applications,
    };
  }

  async reviewApplication(applicationId: string, input: ReviewApplicationInput, reviewerId?: string, reviewerEmail?: string) {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        user: true,
        project: true,
      },
    });

    if (!application) {
      throw new AppError('Application not found', 404);
    }

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: input.status,
        reviewedBy: reviewerId || null,
        reviewedAt: new Date(),
        adminNotes: input.adminNotes?.trim() || null,
      },
      include: {
        user: true,
        project: true,
      },
    });

    const isApproved = input.status === 'APPROVED';

    // Create Notification for the user
    await notificationService.createNotification({
      userId: application.userId,
      title: isApproved ? 'Application Approved! 🎉' : 'Application Status Update',
      message: isApproved
        ? `Congratulations! Your application for "${application.project.title}" has been approved.`
        : `Your application for "${application.project.title}" has been reviewed and declined. ${input.adminNotes ? `Reason: ${input.adminNotes}` : ''}`,
    });

    // Send Decision Email
    const emailObj = emailService.generateApplicationReviewedEmail(
      `${application.user.firstName} ${application.user.lastName}`,
      application.project.title,
      input.status,
      input.adminNotes || undefined
    );
    emailObj.to = application.user.email;
    await emailService.send(emailObj);

    // Create Audit Log
    if (reviewerId) {
      await auditLogService.log({
        actorId: reviewerId,
        action: isApproved ? 'APPLICATION_APPROVED' : 'APPLICATION_REJECTED',
        entityType: 'Application',
        entityId: application.id,
        description: `Admin ${reviewerEmail || reviewerId} marked application ${application.id} for "${application.project.title}" as ${input.status}. Applicant: ${application.user.email}`,
      });
    }

    return { application: updated };
  }
}

export const applicationService = new ApplicationService();

