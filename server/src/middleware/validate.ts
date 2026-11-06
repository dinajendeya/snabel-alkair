import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { sendError } from '../utils/apiResponse';

export function validate(schema: AnyZodObject, source: 'body' | 'query' | 'params' = 'body') {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync(req[source]);
      req[source] = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        sendError(res, 'Validation failed', 400, error.flatten().fieldErrors);
        return;
      }
      sendError(res, 'Validation error', 400);
      return;
    }
  };
}

