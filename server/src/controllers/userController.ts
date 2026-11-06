import { Request, Response } from 'express';
import { userService } from '../services/userService';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/appError';

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError('Unauthorized', 401);
  const result = await userService.getMe(req.user.id);
  return sendSuccess(res, result, undefined, 200);
});

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError('Unauthorized', 401);
  const result = await userService.updateMe(req.user.id, req.body, req.user.email);
  return sendSuccess(res, result, 'Profile updated successfully', 200);
});

export const getMyApplications = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError('Unauthorized', 401);
  const result = await userService.getMyApplications(req.user.id);
  return sendSuccess(res, result, undefined, 200);
});

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError('Unauthorized', 401);
  const result = await userService.changePassword(req.user.id, req.body, req.user.email);
  return sendSuccess(res, result, result.message, 200);
});
