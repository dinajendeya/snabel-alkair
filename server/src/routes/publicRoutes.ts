import { Router } from 'express';
import { getLiveStats } from '../controllers/publicController';
import { emailHistory } from '../services/emailService';

const router = Router();

router.get('/stats', getLiveStats);
router.get('/email-history', (_req, res) => {
  res.status(200).json({ success: true, count: emailHistory.length, emails: emailHistory });
});

export default router;

