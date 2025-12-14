import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Contact extends Document {
  @Prop({ required: true, trim: true, maxlength: 100 })
  name: string;

  @Prop({ required: true, trim: true, lowercase: true, maxlength: 100 })
  email: string;

  @Prop({ required: true, trim: true, maxlength: 200 })
  subject: string;

  @Prop({ required: true, trim: true, maxlength: 1000 })
  message: string;

  @Prop({ default: false })
  read: boolean;

  @Prop()
  readAt?: Date;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
