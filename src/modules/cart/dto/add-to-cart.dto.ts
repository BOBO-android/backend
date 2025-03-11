import { IsValidMongoId } from '@/common/validators/is-mongo-id.decorator';
import { IsNumber, Min } from 'class-validator';

export class AddToCartDto {
  @IsValidMongoId()
  foodId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}
