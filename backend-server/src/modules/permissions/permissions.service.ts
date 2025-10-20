import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permissions, PermissionsDocument } from './permissions.schema';
import { CreatePermissionsDto } from './dto/create-permissions.dto';
import { UpdatePermissionsDto } from './dto/update-permissions.dto';
import { Users, UsersDocument } from '../users/users.schema';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permissions.name) private permissionsModel: Model<PermissionsDocument>,
    @InjectModel(Users.name) private usersModel: Model<UsersDocument>,
  ) {}

  async create(createPermissionsDto: CreatePermissionsDto): Promise<Permissions> {
    const createdPermissions = new this.permissionsModel(createPermissionsDto);
    return createdPermissions.save();
  }

  async findAll(query: any = {}): Promise<Permissions[]> {
    return this.permissionsModel.find(query).exec();
  }

  async findAllWithCreatedBy(query: any = {}): Promise<any[]> {   
    const permissions = await this.permissionsModel.find(query).exec();
    
    if (permissions.length === 0) {
      return [];
    }

    // Lấy tất cả createdById unique
    const createdByIds = [...new Set(permissions.map(p => p.createdById).filter(id => id))];
    
    // Lấy tất cả users trong 1 query
    const users = await this.usersModel.find({
      _id: { $in: createdByIds }
    }).select('name email username role').exec();

    // Tạo map để lookup nhanh
    const userMap = new Map();
    users.forEach(user => {
      const userId = (user._id as any).toString();
      userMap.set(userId, {
        id: userId,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role
      });
    });

    // Map permissions với user info
    return permissions.map(permission => ({
      ...permission.toObject(),
      createdBy: permission.createdById ? userMap.get(permission.createdById) || null : null
    }));
  }

  async findOne(id: string): Promise<Permissions> {
    const permissions = await this.permissionsModel.findById(id).exec();
    if (!permissions) {
      throw new NotFoundException(`Permissions với ID ${id} không tồn tại`);
    }
    return permissions;
  }

  async findOneWithCreatedBy(id: string): Promise<any> {
    const permission = await this.permissionsModel.findById(id).exec();
    if (!permission) {
      throw new NotFoundException(`Permissions với ID ${id} không tồn tại`);
    }

    let createdBy: any = null;
    if (permission.createdById) {
      const user = await this.usersModel.findById(permission.createdById)
        .select('name email username role').exec();
      
      if (user) {
        createdBy = {
          id: (user._id as any).toString(),
          name: user.name,
          email: user.email,
          username: user.username,
          role: user.role
        };
      }
    }

    return {
      ...permission.toObject(),
      createdBy
    };
  }

  async update(id: string, updatePermissionsDto: UpdatePermissionsDto): Promise<Permissions> {
    const updatedPermissions = await this.permissionsModel
      .findByIdAndUpdate(id, updatePermissionsDto, { new: true })
      .exec();
    
    if (!updatedPermissions) {
      throw new NotFoundException(`Permissions với ID ${id} không tồn tại`);
    }
    
    return updatedPermissions;
  }

  async remove(id: string): Promise<void> {
    const result = await this.permissionsModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Permissions với ID ${id} không tồn tại`);
    }
  }

  // Method tối ưu với pagination
  async findAllWithPagination(query: any = {}, options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<{
    data: any[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const skip = (page - 1) * limit;

    // Đếm total
    const total = await this.permissionsModel.countDocuments(query).exec();
    
    // Lấy data với pagination
    const permissions = await this.permissionsModel
      .find(query)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    // Lấy user info nếu có permissions
    let data: any[] = [];
    if (permissions.length > 0) {
      const createdByIds = [...new Set(permissions.map(p => p.createdById).filter(id => id))];
      
      const users = await this.usersModel.find({
        _id: { $in: createdByIds }
      }).select('name email username role').exec();

      const userMap = new Map();
      users.forEach(user => {
        const userId = (user._id as any).toString();
        userMap.set(userId, {
          id: userId,
          name: user.name,
          email: user.email,
          username: user.username,
          role: user.role
        });
      });

      data = permissions.map(permission => ({
        ...permission.toObject(),
        createdBy: permission.createdById ? userMap.get(permission.createdById) || null : null
      }));
    }

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // Method để lấy permissions theo role
  async findPermissionsByRole(role: string): Promise<any[]> {
    const permissions = await this.permissionsModel.find({ isActive: true }).exec();
    
    if (permissions.length === 0) {
      return [];
    }

    const createdByIds = [...new Set(permissions.map(p => p.createdById).filter(id => id))];
    
    const users = await this.usersModel.find({
      _id: { $in: createdByIds }
    }).select('name email username role').exec();

    const userMap = new Map();
    users.forEach(user => {
      const userId = (user._id as any).toString();
      userMap.set(userId, {
        id: userId,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role
      });
    });

    return permissions.map(permission => ({
      ...permission.toObject(),
      createdBy: permission.createdById ? userMap.get(permission.createdById) || null : null
    }));
  }
}