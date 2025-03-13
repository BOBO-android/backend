import { PaymentStatus } from '@/constant';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  FAILED = 'FAILED',
}

export enum PaymentMethod {
  COD = 'COD', // Cash on Delivery
  VNPAY = 'VNPAY', // VNPay
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop([
    {
      foodId: { type: Types.ObjectId, ref: 'Food', required: true },
      quantity: { type: Number, required: true, min: 1 },
    },
  ])
  items: { foodId: Types.ObjectId; quantity: number }[];

  @Prop({ type: Number, required: true })
  totalPrice: number;

  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Prop({ type: String, enum: PaymentMethod, required: true })
  paymentMethod: PaymentMethod;

  @Prop({ type: String, default: null })
  vnpayTransactionId?: string;

  @Prop({ type: String, default: PaymentStatus.UNPAID })
  paymentStatus?: string; // "PAID" or "UNPAID"

  @Prop({ type: String, default: null })
  notes?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
