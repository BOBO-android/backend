import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEmpty, IsNotEmpty, IsString, IsUrl } from 'class-validator';

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
  @IsEmpty()
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

  @ApiProperty({
    example: '1234567890',
    description: 'Bank account number',
  })
  @IsString()
  @IsNotEmpty()
  bankAccountNumber: string;

  @ApiProperty({
    example: 'Vietcombank',
    description: 'Bank type or name',
  })
  @IsString()
  @IsNotEmpty()
  bankType: string;

  @ApiProperty({
    example: 'https://example.com/license.png',
    description: 'Business license image URL',
  })
  @IsUrl()
  @IsNotEmpty()
  businessLicense: string;

  @ApiProperty({
    example: 'https://example.com/logo.png',
    description: 'Store logo image URL',
  })
  @IsUrl()
  @IsNotEmpty()
  logo: string;
}
