import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Project extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  image: string;

  @Prop({ required: true })
  category: string;

  @Prop({ type: [String], required: true })
  technologies: string[];

  @Prop()
  demoUrl: string;

  @Prop()
  githubUrl: string;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: true })
  active: boolean;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
