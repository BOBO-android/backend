import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class VerifyStoreDto {
  @ApiProperty({ example: '654321', description: 'Store ID to verify' })
  @IsNotEmpty()
  storeId: string;

  @ApiProperty({
    example: '123456',
    description: 'Verification code received via email',
  })
  @IsNotEmpty()
  codeId: string;
}
