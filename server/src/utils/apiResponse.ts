import { Response } from 'express';

export interface ApiResponseOptions<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}

export function sendSuccess<T = any>(
  res: Response,
  data?: T,
  message?: string,
  statusCode: number = 200
): Response {
  const payload: Record<string, any> = {
    success: true,
  };

  if (message) {
    payload.message = message;
  }

  if (data !== undefined) {
    // If data is an object, merge its top-level keys for backwards compatibility
    // while also providing data: data
    if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
      Object.assign(payload, data);
    }
    payload.data = data;
  }

  return res.status(statusCode).json(payload);
}

export function sendError(
  res: Response,
  message: string,
  statusCode: number = 400,
  errors?: any
): Response {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
  });
}

