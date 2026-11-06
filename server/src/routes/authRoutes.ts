import { Router } from 'express';
import { register, login, logout, forgotPassword, resetPassword } from '../controllers/authController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', optionalAuth, logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;

