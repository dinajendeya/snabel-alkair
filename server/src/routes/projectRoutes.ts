import { Router } from 'express';
import {
  getProjects,
  getFeaturedProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  updateProjectStatus,
  getProjectAnalytics,
} from '../controllers/projectController';
import { requireAdmin } from '../middleware/authorize';
import { optionalAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createProjectSchema,
  projectQuerySchema,
  updateProjectSchema,
  updateProjectStatusSchema,
} from '../validators/project.schema';

const router = Router();

// Public routes (with optional auth to detect if current user has already applied)
router.get('/', validate(projectQuerySchema, 'query'), getProjects);
router.get('/featured', getFeaturedProjects);
router.get('/:id', optionalAuth, getProjectById);

// Admin-only routes
router.post('/', requireAdmin, validate(createProjectSchema), createProject);
router.patch('/:id', requireAdmin, validate(updateProjectSchema), updateProject);
router.delete('/:id', requireAdmin, deleteProject);
router.patch('/:id/status', requireAdmin, validate(updateProjectStatusSchema), updateProjectStatus);
router.get('/:id/analytics', requireAdmin, getProjectAnalytics);

export default router;

