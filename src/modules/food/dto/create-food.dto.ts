import {
  IsString,
  IsNumber,
  IsMongoId,
  IsBoolean,
  IsOptional,
  Min,
  IsUrl,
} from 'class-validator';

export class CreateFoodDto {
  @IsUrl()
  thumbnail: string; // URL of the dish's image

  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  description: string;

  @IsMongoId()
  storeId: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  preparationTime?: number; // Time in minutes
}
