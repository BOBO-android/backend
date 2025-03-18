import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetEmailByUserNameDto {
  @ApiProperty({
    example: 'john_doe',
    description: 'Username with at least 3 characters',
  })
  @IsNotEmpty()
  @MinLength(3)
  username: string;
}
