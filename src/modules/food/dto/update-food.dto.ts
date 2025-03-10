import {
  IsOptional,
  IsString,
  IsNumber,
  IsPositive,
  IsUrl,
  IsBoolean,
} from 'class-validator';

export class UpdateFoodDto {
  @IsOptional()
  @IsUrl()
  thumbnail: string; // URL of the dish's image

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  preparationTime?: number;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
