import { Request, Response } from 'express';
import { applicationService } from '../services/applicationService';
import { asyncHandler } from '../utils/asyncHandler';
import { ApplicationQueryInput } from '../validators/application.schema';

export const createApplication = asyncHandler(async (req: Request, res: Response) => {
  const result = await applicationService.createApplication(req.user!.id, req.body);
  return res.status(201).json({
    success: true,
    message: 'Application submitted successfully! Check your notifications and email for updates.',
    ...result,
  });
});

export const getMyApplications = asyncHandler(async (req: Request, res: Response) => {
  const result = await applicationService.getMyApplications(req.user!.id);
  return res.status(200).json({ success: true, ...result });
});

export const getAllApplications = asyncHandler(async (req: Request, res: Response) => {
  const result = await applicationService.getAllApplications(
    req.query as unknown as ApplicationQueryInput
  );
  return res.status(200).json({ success: true, ...result });
});

export const reviewApplication = asyncHandler(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await applicationService.reviewApplication(
    id,
    req.body,
    req.user?.id,
    req.user?.email
  );
  const status = req.body.status;
  return res.status(200).json({
    success: true,
    message: `Application marked as ${status}. Applicant has been notified.`,
    ...result,
  });
});
