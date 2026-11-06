import { z } from 'zod';

export const createProjectSchema = z.object({
  title: z.string().min(3, 'Title is required (min 3 characters)'),
  slug: z.string().optional(),
  shortDescription: z.string().min(5, 'Short description is required'),
  description: z.string().min(10, 'Full description is required'),
  objectives: z.string().optional().nullable(),
  eligibility: z.string().optional().nullable(),
  requirements: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  category: z.enum([
    'FOOD',
    'EDUCATION',
    'CLOTHING',
    'WATER',
    'SHELTER',
    'HEALTH',
    'ORPHAN_SUPPORT',
    'TRAINING',
    'ECONOMIC_SUPPORT',
  ]),
  status: z.enum(['RUNNING', 'PAUSED', 'COMPLETED']).default('RUNNING'),
  targetBeneficiaries: z.number().int().nonnegative().optional().nullable(),
  targetVolunteers: z.number().int().nonnegative().optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export const updateProjectSchema = createProjectSchema.partial();
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

export const updateProjectStatusSchema = z.object({
  status: z.enum(['RUNNING', 'PAUSED', 'COMPLETED']),
});

export type UpdateProjectStatusInput = z.infer<typeof updateProjectStatusSchema>;

export const projectQuerySchema = z.object({
  search: z.string().optional(),
  status: z.enum(['RUNNING', 'PAUSED', 'COMPLETED']).optional(),
  category: z
    .enum([
      'FOOD',
      'EDUCATION',
      'CLOTHING',
      'WATER',
      'SHELTER',
      'HEALTH',
      'ORPHAN_SUPPORT',
      'TRAINING',
      'ECONOMIC_SUPPORT',
    ])
    .optional(),
});

export type ProjectQueryInput = z.infer<typeof projectQuerySchema>;

