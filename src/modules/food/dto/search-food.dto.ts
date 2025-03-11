import { IsOptional, IsString } from 'class-validator';

export class SearchFoodDto {
  @IsOptional()
  @IsString()
  query?: string;
}
