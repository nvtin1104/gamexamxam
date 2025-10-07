import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError.js';

// Global error handling middleware
export function errorHandler(err: Error | ApiError, req: Request, res: Response, next: NextFunction) {
  const status = err instanceof ApiError ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ success: false, message });
}

export default errorHandler;
