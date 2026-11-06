import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';

export function notFound(req: Request, _res: Response, next: NextFunction): void {
  next(new AppError(`API endpoint not found: ${req.method} ${req.originalUrl}`, 404));
}

