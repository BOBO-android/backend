import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    example: 'john_doe_updated',
    description: 'Updated username',
    required: false,
  })
  @IsOptional()
  username: string;

  @ApiProperty({
    example: 'john_new@example.com',
    description: 'Updated email address',
    required: false,
  })
  @IsOptional()
  email: string;

  @ApiProperty({
    example: 'newpassword123',
    description: 'Updated password',
    required: false,
  })
  @IsOptional()
  password: string;

  @ApiProperty({
    example: 'https://example.com/new_profile.jpg',
    description: 'Updated profile image URL',
    required: false,
  })
  @IsOptional()
  image: string;

  @ApiProperty({ example: 'admin', description: 'User role', required: false })
  @IsOptional()
  role: string;
}
