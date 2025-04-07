import { OrderStatus, PaymentStatus } from '@/constant';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

export enum PaymentMethod {
  COD = 'COD', // Cash on Delivery
  VNPAY = 'VNPAY', // VNPay
}

@Schema()
export class FoodItem {
  @Prop({ type: Types.ObjectId, ref: 'Food', required: true })
  foodId: Types.ObjectId;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: String, required: true })
  imageUrl: string;

  @Prop({ type: Number, required: true, min: 1 })
  quantity: number;
}

const FoodItemSchema = SchemaFactory.createForClass(FoodItem);

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Store', required: true })
  storeId: Types.ObjectId;

  @Prop({ type: String, required: true })
  userName: string;

  @Prop({ type: String, required: false, default: null })
  userImageUrl: string;

  @Prop({ type: Date, required: true })
  orderTime: Date;

  @Prop({ type: Number, required: true })
  totalPrice: number;

  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Prop({ type: String, enum: PaymentMethod, required: true })
  paymentMethod: PaymentMethod;

  @Prop({ type: String, default: PaymentStatus.UNPAID })
  paymentStatus?: string;

  @Prop({ type: Date })
  deliveryDate: Date;

  @Prop({ type: String })
  deliverTo: string;

  @Prop({ type: [FoodItemSchema], required: true })
  foodItems: FoodItem[];

  @Prop({ type: String, default: null })
  vnpayTransactionId?: string;

  @Prop({ type: String, default: null })
  notes?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
