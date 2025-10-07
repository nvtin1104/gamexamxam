import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '@/config/env.js';
import { ApiError } from '@/utils/apiError.js';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) {
    return next(new ApiError(401, 'Unauthorized'));
  }

  try {
    const payload = jwt.verify(token, env.jwt.accessSecret) as { id: string; role: string };
    req.user = payload;
    return next();
  } catch (e) {
    return next(new ApiError(401, 'Invalid or expired token'));
  }
}

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return next(new ApiError(403, 'Forbidden'));
  }
  return next();
}

export default { authMiddleware, isAdmin };
