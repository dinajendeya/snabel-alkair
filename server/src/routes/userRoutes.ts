import { Router } from 'express';
import { getMe, updateMe, getMyApplications, changePassword } from '../controllers/userController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/me', getMe);
router.patch('/me', updateMe);
router.get('/me/applications', getMyApplications);
router.patch('/me/password', changePassword);

export default router;

