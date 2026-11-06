import prisma from '../prisma';
import { RegisterInput, LoginInput, ForgotPasswordInput, ResetPasswordInput } from '../validators/auth.schema';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { AppError } from '../utils/appError';
import { auditLogService } from './auditLogService';
import { emailService } from './emailService';
import { notificationService } from './notificationService';
import { toDateOrNull } from '../utils/date';
import { UserRole } from '@prisma/client';

export class AuthService {
  async register(input: RegisterInput) {
    const email = input.email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('An account with this email already exists. Please log in instead.', 409);
    }

    const passwordHash = await hashPassword(input.password);

    // Create User
    const user = await prisma.user.create({
      data: {
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        email,
        passwordHash,
        phone: input.phone.trim(),
        birthDate: toDateOrNull(input.birthDate),
        governorate: input.governorate || null,
        address: input.address?.trim() || null,
        bio: input.bio?.trim() || null,
        role: input.role as UserRole,
      },
    });

    // Create Welcome Notification
    await notificationService.createNotification({
      userId: user.id,
      title: 'Welcome to Senabil!',
      message: `Welcome, ${user.firstName}! Your account as a ${user.role.toLowerCase()} has been created successfully. Explore projects and make an impact.`,
    });

    // Send Welcome Email
    const welcomeMail = emailService.generateWelcomeEmail(`${user.firstName} ${user.lastName}`);
    welcomeMail.to = user.email;
    await emailService.send(welcomeMail);

    // Create Audit Log
    await auditLogService.log({
      actorId: user.id,
      action: 'USER_REGISTERED',
      entityType: 'User',
      entityId: user.id,
      description: `New ${user.role} registered: ${user.firstName} ${user.lastName} (${user.email})`,
    });

    // Generate JWT Token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        birthDate: user.birthDate,
        governorate: user.governorate,
        address: user.address,
        bio: user.bio,
        role: user.role,
        createdAt: user.createdAt,
      },
    };
  }

  async login(input: LoginInput) {
    const email = input.email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('Invalid credentials. Please check your email and password.', 401);
    }

    const isMatch = await comparePassword(input.password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid credentials. Please check your email and password.', 401);
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    await auditLogService.log({
      actorId: user.id,
      action: 'USER_LOGGED_IN',
      entityType: 'User',
      entityId: user.id,
      description: `User ${user.email} logged in.`,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        birthDate: user.birthDate,
        governorate: user.governorate,
        address: user.address,
        bio: user.bio,
        role: user.role,
        createdAt: user.createdAt,
      },
    };
  }

  async logout(actorId?: string, email?: string) {
    if (actorId && email) {
      await auditLogService.log({
        actorId,
        action: 'USER_LOGGED_OUT',
        entityType: 'User',
        entityId: actorId,
        description: `User ${email} logged out.`,
      });
    }
    return { message: 'Logged out successfully.' };
  }

  async forgotPassword(input: ForgotPasswordInput) {
    const email = input.email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      await emailService.send({
        to: user.email,
        subject: 'Reset your Senabil Password',
        type: 'PASSWORD_RESET',
        html: `<p>Dear ${user.firstName},</p><p>We received a password reset request for your account. You can reset your password using our secure reset gateway.</p>`,
      });

      await auditLogService.log({
        actorId: user.id,
        action: 'PASSWORD_RESET_REQUESTED',
        entityType: 'User',
        entityId: user.id,
        description: `Password reset requested for ${user.email}`,
      });
    }

    return {
      message: 'If an account exists with that email, a password reset link has been dispatched.',
    };
  }

  async resetPassword(input: ResetPasswordInput) {
    const email = input.email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    const passwordHash = await hashPassword(input.newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    await auditLogService.log({
      actorId: user.id,
      action: 'PASSWORD_RESET',
      entityType: 'User',
      entityId: user.id,
      description: `Password reset successfully for ${user.email}`,
    });

    return {
      message: 'Password has been reset successfully. You may now login.',
    };
  }
}

export const authService = new AuthService();

