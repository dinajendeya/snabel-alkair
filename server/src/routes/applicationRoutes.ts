import { Router } from 'express';
import {
  createApplication,
  getMyApplications,
  getAllApplications,
  reviewApplication,
} from '../controllers/applicationController';
import { requireAuth } from '../middleware/auth';
import { requireAdmin } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import {
  applicationQuerySchema,
  createApplicationSchema,
  reviewApplicationSchema,
} from '../validators/application.schema';

const router = Router();

router.post('/', requireAuth, validate(createApplicationSchema), createApplication);
router.get('/me', requireAuth, getMyApplications);
router.get('/', requireAdmin, validate(applicationQuerySchema, 'query'), getAllApplications);
router.patch('/:id/review', requireAdmin, validate(reviewApplicationSchema), reviewApplication);

export default router;

