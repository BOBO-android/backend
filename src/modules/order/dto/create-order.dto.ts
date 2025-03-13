import { PaymentMethod } from '@/constant';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsEnum([PaymentMethod.COD, PaymentMethod.VNPAY], {
    message: 'Invalid payment method',
  })
  paymentMethod: PaymentMethod.COD | PaymentMethod.VNPAY;
}
