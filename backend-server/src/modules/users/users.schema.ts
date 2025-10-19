import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UsersDocument = Users & Document;

@Schema({ timestamps: true, versionKey: false })
export class Users {
  @Prop({
    required: [true, 'Tên người dùng là bắt buộc'],
    maxlength: [100, 'Tên người dùng không được vượt quá 100 ký tự'],
    minlength: [3, 'Tên người dùng không được ít hơn 3 ký tự'],
    trim: true,
  })
  name: string;
  @Prop({
    required: [true, 'Email là bắt buộc'],
    unique: [true, 'Email đã tồn tại'],
    lowercase: true,
    trim: true,
  })
  email: string;
  @Prop({
    required: [true, 'Tên người là bắt buộc'],
    unique: [true, 'Tên người dùng đã tồn tại'],
    lowercase: true,
    trim: true,
  })
  username: string;
  @Prop({
    required: [true, 'Mật khẩu là bắt buộc'],
    trim: true,
  })
  password: string;
  @Prop({
    type: Date,
    validate: {
      validator: (value: Date) => {
        if (value) {
          return value instanceof Date && !isNaN(value.getTime());
        }
        return true;
      },
      message: 'Ngày sinh không hợp lệ',
    },
    default: null,
  })
  birthDate: Date;
  @Prop({ default: true })
  isActive: boolean;
  @Prop({ default: false })
  canLoginGoogle: boolean;
  @Prop({ default: false })
  isLinkedGoogle: boolean;
  @Prop({ default: false })
  canLoginFacebook: boolean;
  @Prop({ default: false })
  isLinkedFacebook: boolean;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
