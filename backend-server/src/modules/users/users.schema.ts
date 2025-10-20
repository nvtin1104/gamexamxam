import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
export type UsersDocument = Users & Document;

@Schema({
  timestamps: true,
  versionKey: false,
  toJSON: {
    transform: (_doc: any, ret: any) => {
      delete ret.password;
      return ret;
    },
  },
})
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
  canLoginGoogle: boolean;
  @Prop({ default: false })
  isLinkedGoogle: boolean;
  @Prop({ default: false })
  canLoginFacebook: boolean;
  @Prop({ default: false })
  isLinkedFacebook: boolean;
  @Prop({
    type: String,
    enum: ['user', 'admin', 'moderator', 'staff', 'root', 'partner'],
    default: 'user'
  })
  role: string;
  @Prop({
    type: String,
    default: null
  })
  permission: string;
  @Prop({
    type: String,
    enum: ['active', 'inactive', 'blocked', 'deleted', 'locked'],
    default: 'active'
  })
  status: string;
}
export const UsersSchema = SchemaFactory.createForClass(Users);
UsersSchema.pre('save', async function (next: any) {
  const user = this as UsersDocument;

  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (err) {
    next(err as Error);
  }
});
UsersSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};
