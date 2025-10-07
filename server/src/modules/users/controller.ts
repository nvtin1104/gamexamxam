// User controller using class-based approach
import { Request, Response } from 'express';
import * as userService from './service.js';
import catchAsync from '@/utils/catchAsync.js';

export class UserController {
  // GET /api/users - Lấy danh sách users
  getUsers = catchAsync(async (req: Request, res: Response) => {
    const users = await userService.listUsers();
    res.json({ success: true, data: users });
  });

  // POST /api/users - Tạo user mới
  createUser = catchAsync(async (req: Request, res: Response) => {
    const user = await userService.createUser(req.body);
    res.status(201).json({ success: true, data: user });
  });

  // PUT /api/users/:id - Cập nhật user
  updateUser = catchAsync(async (req: Request, res: Response) => {
    const user = await userService.updateUser(req.params.id, req.body);
    res.json({ success: true, data: user });
  });

  // DELETE /api/users/:id - Xóa user (soft delete)
  removeUser = catchAsync(async (req: Request, res: Response) => {
    const user = await userService.deleteUser(req.params.id);
    res.json({ success: true, data: user });
  });
}

// Export instance
export default new UserController();
