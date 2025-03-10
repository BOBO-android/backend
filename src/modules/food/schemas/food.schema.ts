import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomBytes } from 'crypto';
import { HydratedDocument, Types } from 'mongoose';
import slugify from 'slugify';

export type FoodDocument = HydratedDocument<Food>;

@Schema({ timestamps: true })
export class Food {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'Store', required: true })
  storeId: Types.ObjectId;

  @Prop({ default: true })
  isAvailable: boolean;

  @Prop({ default: 0 })
  preparationTime: number; // In minutes

  @Prop({ default: 5, min: 1, max: 5 })
  rating: number; // Between 1 and 5

  @Prop()
  thumbnail: string; // URL of dish image

  @Prop({ unique: true, index: true })
  slug: string;
}

export const FoodSchema = SchemaFactory.createForClass(Food);

// Middleware: Auto-generate unique slug before saving
FoodSchema.pre<FoodDocument>('save', async function (next) {
  if (this.isModified('name') || this.isNew) {
    const baseSlug = slugify(this.name, { lower: true, strict: true });
    const uniqueSuffix = randomBytes(3).toString('hex'); // Generate a 6-character hex string
    this.slug = `${baseSlug}-${uniqueSuffix}`;
  }
  next();
});
