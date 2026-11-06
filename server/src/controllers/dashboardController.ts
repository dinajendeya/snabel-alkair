import { Request, Response } from 'express';
import { dashboardService } from '../services/dashboardService';
import { asyncHandler } from '../utils/asyncHandler';

export const getOverview = asyncHandler(async (_req: Request, res: Response) => {
  const result = await dashboardService.getOverview();
  return res.status(200).json({ success: true, ...result });
});

export const getDashboardProjects = asyncHandler(async (_req: Request, res: Response) => {
  const result = await dashboardService.getDashboardProjects();
  return res.status(200).json({ success: true, ...result });
});

export const getBeneficiaries = asyncHandler(async (_req: Request, res: Response) => {
  const result = await dashboardService.getBeneficiaries();
  return res.status(200).json({ success: true, ...result });
});

export const getVolunteers = asyncHandler(async (_req: Request, res: Response) => {
  const result = await dashboardService.getVolunteers();
  return res.status(200).json({ success: true, ...result });
});

export const getAuditLogs = asyncHandler(async (req: Request, res: Response) => {
  const { action, search, limit = '100' } = req.query;
  const result = await dashboardService.getAuditLogs({
    action: typeof action === 'string' ? action : undefined,
    search: typeof search === 'string' ? search : undefined,
    limit: Number(limit) || 100,
  });
  return res.status(200).json({ success: true, ...result });
});
