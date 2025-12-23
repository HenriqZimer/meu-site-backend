import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Skill extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  icon: string;

  @Prop({ required: true })
  color: string;

  @Prop({ default: true })
  active: boolean;
}

export const SkillSchema = SchemaFactory.createForClass(Skill);
