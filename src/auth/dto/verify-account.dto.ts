import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class VerifyAccountDto {
  @ApiProperty({ example: 'johndoe', description: 'Username of the user' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: '123456', description: 'Verification code' })
  @IsNotEmpty()
  codeId: string;
}
