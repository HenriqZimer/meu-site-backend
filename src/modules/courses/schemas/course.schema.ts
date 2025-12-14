import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Course extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  platform: string;

  @Prop({ required: true })
  instructor: string;

  @Prop()
  duration: string;

  @Prop()
  image: string;

  @Prop()
  link: string;

  @Prop()
  year: string;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: true })
  active: boolean;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
