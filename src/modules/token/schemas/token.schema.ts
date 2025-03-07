import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Token {
  @Prop()
  refreshToken: string;

  @Prop({ ref: 'users', type: Types.ObjectId })
  userId: string;

  @Prop({ type: [] })
  refresTokensUsed: string[];
}

export const TokenSchema = SchemaFactory.createForClass(Token);
