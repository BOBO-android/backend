import { PaymentMethod } from '@/constant';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Payment method for the order',
    enum: PaymentMethod,
    example: PaymentMethod.COD,
  })
  @IsNotEmpty()
  @IsEnum(PaymentMethod, {
    message: 'Invalid payment method',
  })
  paymentMethod: PaymentMethod;
}
