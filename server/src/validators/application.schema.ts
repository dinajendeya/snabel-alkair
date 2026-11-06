import { z } from 'zod';

export const createApplicationSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  motivation: z.string().min(10, 'Motivation must be at least 10 characters'),
  notes: z.string().optional().nullable(),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;

export const reviewApplicationSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  adminNotes: z.string().optional().nullable(),
});

export type ReviewApplicationInput = z.infer<typeof reviewApplicationSchema>;

export const applicationQuerySchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  projectId: z.string().optional(),
  role: z.enum(['BENEFICIARY', 'VOLUNTEER']).optional(),
});

export type ApplicationQueryInput = z.infer<typeof applicationQuerySchema>;

