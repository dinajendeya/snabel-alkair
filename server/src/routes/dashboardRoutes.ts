import { Router } from 'express';
import {
  getOverview,
  getDashboardProjects,
  getBeneficiaries,
  getVolunteers,
  getAuditLogs,
} from '../controllers/dashboardController';
import { getAllApplications } from '../controllers/applicationController';
import { requireAdmin } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { applicationQuerySchema } from '../validators/application.schema';

const router = Router();

router.use(requireAdmin);

router.get('/overview', getOverview);
router.get('/projects', getDashboardProjects);
router.get('/beneficiaries', getBeneficiaries);
router.get('/volunteers', getVolunteers);
router.get('/applications', validate(applicationQuerySchema, 'query'), getAllApplications);
router.get('/audit-logs', getAuditLogs);

export default router;

