import { ROLES } from '@/constant';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop()
  fullName: string;

  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop()
  phoneNunber: string;

  @Prop()
  password: string;

  @Prop()
  image: string;

  @Prop({ default: ROLES.user })
  role: string;

  @Prop({ default: false })
  isActive: boolean;

  @Prop()
  codeId: string;

  @Prop()
  codeExpired: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
