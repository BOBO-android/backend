import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStoreStatusDto {
  @ApiProperty({
    enum: ['active', 'inactive', 'violation'],
    description: 'Status of the store',
    example: 'active',
  })
  @IsEnum(['active', 'inactive', 'violation'], { message: 'Invalid status' })
  status: 'active' | 'inactive' | 'violation';
}
