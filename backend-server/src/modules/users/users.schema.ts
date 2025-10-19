import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UsersDocument = Users & Document;

@Schema({ timestamps: true, versionKey: false })
export class Users {
  @Prop({
    required: [true, 'Tên người dùng là bắt buộc'],
  })
  name: string;

  @Prop()
  description?: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
