import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateStoreDto {
  @ApiProperty({ example: 'Tech Store', description: 'Name of the store' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Best store for tech products',
    description: 'Description of the store',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: '123 Main St, New York',
    description: 'Address of the store',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    example: 'store@example.com',
    description: 'Email associated with the store',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
