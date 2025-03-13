import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MediaDocument = Media & Document;

@Schema({ timestamps: true })
export class Media {
  @Prop({ required: true })
  ownerId: string;

  @Prop({ required: true })
  publicId: string;

  @Prop({ required: true })
  secureUrl: string;
}

export const MediaSchema = SchemaFactory.createForClass(Media);
