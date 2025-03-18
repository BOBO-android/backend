import { IsValidMongoId } from '@/common/validators/is-mongo-id.decorator';
import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({
    description: 'ID of the food item',
    example: '65f4b5c3e2a4d9a7c8b3e6f2',
  })
  @IsValidMongoId()
  foodId: string;

  @ApiProperty({
    description: 'Quantity of the food item',
    example: 2,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  quantity: number;
}
