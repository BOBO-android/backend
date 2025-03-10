import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomBytes } from 'crypto';
import { HydratedDocument, Model, Query, Types } from 'mongoose';
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

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: null })
  deletedAt?: Date | null; // Soft delete field
}

export const FoodSchema = SchemaFactory.createForClass(Food);

// Middleware: Auto-exclude soft-deleted items from queries
FoodSchema.pre(/^find/, function (this: Query<any, any>, next) {
  this.setQuery({ ...this.getQuery(), isDeleted: false }); // Ensure only active records are fetched
  next();
});

// Middleware: Generate unique slug before saving
FoodSchema.pre<FoodDocument>('save', async function (next) {
  if (!this.isModified('name') && this.slug) return next(); // Skip if name hasn't changed

  const baseSlug = slugify(this.name, { lower: true, strict: true });
  let uniqueSlug = baseSlug;

  // Check if slug already exists and generate a new one if needed
  const FoodModel = this.constructor as Model<FoodDocument>;
  let slugExists = await FoodModel.exists({ slug: uniqueSlug });

  while (slugExists) {
    const uniqueSuffix = randomBytes(3).toString('hex'); // Generate a 6-character hash
    uniqueSlug = `${baseSlug}-${uniqueSuffix}`;
    slugExists = await FoodModel.exists({ slug: uniqueSlug });
  }

  this.slug = uniqueSlug;
  next();
});
