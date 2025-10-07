// Auth controller using class-based approach
import { Request, Response } from 'express';
import * as authService from './service.js';
import catchAsync from '@/utils/catchAsync.js';

export class AuthController {
  // POST /api/auth/register - Đăng ký user mới
  register = catchAsync(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    res.status(201).json({ success: true, data: result });
  });

  // POST /api/auth/login - Đăng nhập
  login = catchAsync(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    res.json({ success: true, data: result });
  });

  // POST /api/auth/refresh - Làm mới token
  refresh = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const result = await authService.refresh(refreshToken);
    res.json({ success: true, data: result });
  });
}

// Export instance
export default new AuthController();
