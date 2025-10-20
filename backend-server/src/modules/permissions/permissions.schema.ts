import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PermissionsDocument = Permissions & Document;

@Schema({ timestamps: true })
export class Permissions {
  @Prop({
    required: [true, 'Tên quyền là bắt buộc'],
    maxlength: [100, 'Tên quyền không được vượt quá 100 ký tự'],
    minlength: [3, 'Tên quyền không được ít hơn 3 ký tự'],
    trim: true,
  })
  name: string;

  @Prop()
  description?: string;

  @Prop({
    type: Boolean,
    default: true
  })
  isActive: boolean;

  @Prop({
    type: Array,
    default: []
  })
  actions: string[];

  @Prop({
    type: String,
    default: null
  })
  createdById?: string;
}

export const PermissionsSchema = SchemaFactory.createForClass(Permissions);
