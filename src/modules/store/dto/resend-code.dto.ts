import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendCodeDto {
  @ApiProperty({
    example: 'store@example.com',
    description: 'Email to resend verification code',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
