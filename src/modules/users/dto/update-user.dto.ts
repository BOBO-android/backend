import { IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  username: string;

  @IsOptional()
  email: string;

  @IsOptional()
  password: string;

  @IsOptional()
  image: string;

  @IsOptional()
  role: string;
}
