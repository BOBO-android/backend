import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop([
    {
      foodId: { type: Types.ObjectId, ref: 'Food', required: true },
      quantity: { type: Number, required: true, min: 1 },
    },
  ])
  items: { foodId: Types.ObjectId; quantity: number }[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
