import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendCodeDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email to resend code',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
