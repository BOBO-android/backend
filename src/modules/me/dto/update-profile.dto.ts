import { IsOptional, IsString, IsUrl, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Nguyễn Văn A', description: 'Họ và tên' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    description: 'URL ảnh đại diện',
  })
  @IsOptional()
  @IsUrl({}, { message: 'Image must be a valid URL' })
  image?: string;

  @ApiPropertyOptional({
    example: '0987654321',
    description: 'Số điện thoại (10 chữ số)',
  })
  @IsOptional()
  @Matches(/^(0|\+84)[0-9]{9}$/, {
    message: 'Phone number must be valid Vietnamese number',
  })
  phoneNumber?: string;

  @ApiPropertyOptional({
    example: '123 Đường Lê Lợi, Quận 1, TP.HCM',
    description: 'Địa chỉ',
  })
  @IsOptional()
  @IsString()
  address?: string;
}
