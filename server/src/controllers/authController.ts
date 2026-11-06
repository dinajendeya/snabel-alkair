import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  return sendSuccess(res, result, 'Registration successful! Welcome to Senabil.', 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  return sendSuccess(res, result, 'Logged in successfully.', 200);
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.logout(req.user?.id, req.user?.email);
  return sendSuccess(res, result, 'Logged out successfully.', 200);
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.forgotPassword(req.body);
  return sendSuccess(res, result, result.message, 200);
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.resetPassword(req.body);
  return sendSuccess(res, result, result.message, 200);
});
