import { STATUS_STORE } from '@/constant';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type StoreDocument = Store & Document;

@Schema({ timestamps: true })
export class Store {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ type: String, required: false, default: null })
  description?: string | null;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({ ref: 'User', type: Types.ObjectId, required: true, unique: true })
  owner: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  followerCount: number;

  @Prop({ type: Number, default: 0 })
  propductsCount: number;

  @Prop({ required: true })
  bankAccountNumber: string;

  @Prop({ required: true })
  bankType: string;

  @Prop({ required: true })
  businessLicense: string;

  @Prop({ required: true })
  logo: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({
    required: true,
    enum: [
      STATUS_STORE.ACTIVE,
      STATUS_STORE.INACTIVE,
      STATUS_STORE.PENDING,
      STATUS_STORE.VIOLATION,
    ],
    default: STATUS_STORE.PENDING,
  })
  status: string;

  @Prop({ type: Boolean, default: false })
  isActive: boolean;

  @Prop({ type: Boolean, default: false })
  isViolation: boolean;

  @Prop({ type: String, required: true })
  codeId: string;

  @Prop({ type: Date, required: true })
  codeExpired: Date;
}

export const StoreSchema = SchemaFactory.createForClass(Store);
