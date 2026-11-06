import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { corsOptions } from './config/cors';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import projectRoutes from './routes/projectRoutes';
import applicationRoutes from './routes/applicationRoutes';
import notificationRoutes from './routes/notificationRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import publicRoutes from './routes/publicRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/public', publicRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Senabil Community Impact Platform API',
    timestamp: new Date().toISOString(),
  });
});

// 404 + Global error handler
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🌿 Senabil Server running on http://localhost:${PORT}`);
});

export default app;
