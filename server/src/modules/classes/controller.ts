// Classes controller using class-based approach
import { Request, Response } from 'express';
import classesService from './service.js';
import catchAsync from '@/utils/catchAsync.js';

export class ClassesController {
  // GET /api/classes - Lấy danh sách classes
  getClassess = catchAsync(async (req: Request, res: Response) => {
    const items = await classesService.list();
    res.json({ success: true, data: items });
  });

  // GET /api/classes/:id - Lấy classes theo ID
  getClassesById = catchAsync(async (req: Request, res: Response) => {
    const item = await classesService.getById(req.params.id);
    res.json({ success: true, data: item });
  });

  // POST /api/classes - Tạo classes mới
  createClasses = catchAsync(async (req: Request, res: Response) => {
    const item = await classesService.create(req.body);
    res.status(201).json({ success: true, data: item });
  });

  // PUT /api/classes/:id - Cập nhật classes
  updateClasses = catchAsync(async (req: Request, res: Response) => {
    const item = await classesService.update(req.params.id, req.body);
    res.json({ success: true, data: item });
  });

  // DELETE /api/classes/:id - Xóa classes (soft delete)
  removeClasses = catchAsync(async (req: Request, res: Response) => {
    const item = await classesService.delete(req.params.id);
    res.json({ success: true, data: item });
  });
}

// Export instance
export default new ClassesController();
