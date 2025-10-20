import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users, UsersDocument } from './users.schema';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private usersModel: Model<UsersDocument>,
  ) { }

  async create(createUsersDto: CreateUsersDto): Promise<Users> {
    try {
      const payload: any = { ...createUsersDto };
      if (payload.birthDate) {
        const d = new Date(payload.birthDate as unknown as string);
        payload.birthDate = isNaN(d.getTime()) ? null : d;
      }

      const users = new this.usersModel(payload);
      return await users.save();
    } catch (error: any) {
      const message = error?.message || 'Không thể tạo người dùng';
      throw new BadRequestException(message);
    }
  }

  async findAll(query: any = {}): Promise<Users[]> {
    return this.usersModel.find(query).exec();
  }

  async findOne(id: string): Promise<Users> {
    const users = await this.usersModel.findById(id).exec();
    if (!users) {
      throw new NotFoundException(`Users với ID ${id} không tồn tại`);
    }
    return users;
  }

  async update(id: string, updateUsersDto: UpdateUsersDto): Promise<Users> {
    const updatedUsers = await this.usersModel
      .findByIdAndUpdate(id, updateUsersDto, { new: true })
      .exec();

    if (!updatedUsers) {
      throw new NotFoundException(`Users với ID ${id} không tồn tại`);
    }

    return updatedUsers;
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Users với ID ${id} không tồn tại`);
    }
  }

  async findByEmail(email: string): Promise<Users | null> {
    return this.usersModel.findOne({ email }).exec();
  }
}
