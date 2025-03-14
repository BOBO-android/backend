import { IsValidMongoId } from '@/common/validators/is-mongo-id.decorator';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFoodDto {
  @ApiProperty({
    example: 'https://example.com/food.jpg',
    description: 'URL of the dish image',
  })
  @IsUrl()
  thumbnail: string;

  @ApiProperty({
    example: 'Grilled Chicken',
    description: 'Name of the food item',
  })
  @IsString()
  name: string;

  @ApiProperty({ example: 15.99, description: 'Price of the food item' })
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 'Delicious grilled chicken with herbs',
    description: 'Food description',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: '65f3c4e8a6e2f1b7e8e12345',
    description: 'Store ID (MongoDB ObjectId)',
  })
  @IsValidMongoId()
  storeId: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Availability of the food item',
  })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiPropertyOptional({
    example: 30,
    description: 'Preparation time in minutes',
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  preparationTime?: number;
}
