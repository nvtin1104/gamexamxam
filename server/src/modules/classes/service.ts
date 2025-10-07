// Classes service - Business logic
import Classes from './model.js';
import { ApiError } from '@/utils/apiError.js';

export class ClassesService {
  // Lấy danh sách classes
  async list() {
    return Classes.find({ isDeleted: false });
  }

  // Lấy theo ID
  async getById(id) {
    const item = await Classes.findOne({ _id: id, isDeleted: false });
    if (!item) throw new ApiError(404, 'Classes not found');
    return item;
  }

  // Tạo mới
  async create(data) {
    const item = await Classes.create(data);
    return item;
  }

  // Cập nhật
  async update(id, data) {
    const item = await Classes.findOne({ _id: id, isDeleted: false });
    if (!item) throw new ApiError(404, 'Classes not found');
    
    Object.assign(item, data);
    await item.save();
    return item;
  }

  // Xóa (soft delete)
  async delete(id) {
    const item = await Classes.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true, isActive: false },
      { new: true }
    );
    if (!item) throw new ApiError(404, 'Classes not found');
    return item;
  }
}

export default new ClassesService();
