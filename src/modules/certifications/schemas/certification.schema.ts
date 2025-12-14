import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Certification extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  issuer: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  link: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  skills: number;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: true })
  active: boolean;
}

export const CertificationSchema = SchemaFactory.createForClass(Certification);
