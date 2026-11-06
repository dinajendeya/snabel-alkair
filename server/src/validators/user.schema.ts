import { z } from 'zod';

export const updateProfileSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phone: z.string().min(6).optional(),
  birthDate: z.string().optional().nullable(),
  governorate: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

