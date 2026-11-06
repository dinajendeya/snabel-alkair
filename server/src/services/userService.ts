import prisma from '../prisma';
import { UpdateProfileInput, ChangePasswordInput } from '../validators/user.schema';
import { hashPassword, comparePassword } from '../utils/password';
import { AppError } from '../utils/appError';
import { auditLogService } from './auditLogService';
import { toDateOrNull } from '../utils/date';

export class UserService {
  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        birthDate: true,
        governorate: true,
        address: true,
        bio: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            applications: true,
            notifications: { where: { isRead: false } },
          },
        },
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return { user };
  }

  async updateMe(userId: string, input: UpdateProfileInput, email: string) {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(input.firstName ? { firstName: input.firstName.trim() } : {}),
        ...(input.lastName ? { lastName: input.lastName.trim() } : {}),
        ...(input.phone ? { phone: input.phone.trim() } : {}),
        ...(input.birthDate !== undefined ? { birthDate: toDateOrNull(input.birthDate) } : {}),
        ...(input.governorate !== undefined ? { governorate: input.governorate } : {}),
        ...(input.address !== undefined ? { address: input.address?.trim() || null } : {}),
        ...(input.bio !== undefined ? { bio: input.bio?.trim() || null } : {}),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        birthDate: true,
        governorate: true,
        address: true,
        bio: true,
        role: true,
        updatedAt: true,
      },
    });

    await auditLogService.log({
      actorId: userId,
      action: 'USER_PROFILE_UPDATED',
      entityType: 'User',
      entityId: userId,
      description: `User ${email} updated profile details.`,
    });

    return {
      user: updatedUser,
    };
  }

  async getMyApplications(userId: string) {
    const applications = await prisma.application.findMany({
      where: { userId },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            slug: true,
            category: true,
            status: true,
            imageUrl: true,
            startDate: true,
            endDate: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { applications };
  }

  async changePassword(userId: string, input: ChangePasswordInput, email: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const isMatch = await comparePassword(input.currentPassword, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Current password is incorrect.', 400);
    }

    const passwordHash = await hashPassword(input.newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    await auditLogService.log({
      actorId: user.id,
      action: 'PASSWORD_CHANGED',
      entityType: 'User',
      entityId: user.id,
      description: `User ${email} changed password.`,
    });

    return { message: 'Password changed successfully.' };
  }
}

export const userService = new UserService();

