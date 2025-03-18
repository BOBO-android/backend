import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'john_doe', description: 'Unique username' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Valid email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'https://example.com/profile.jpg',
    description: 'Profile image URL',
    required: false,
  })
  image: string;
}
