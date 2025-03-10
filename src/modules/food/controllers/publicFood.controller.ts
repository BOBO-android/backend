import { FoodService } from '../food.service';
import { Controller, Get, Query, HttpCode } from '@nestjs/common';
import { Public, ResponseMessage } from '@/decorator/customize';

@Controller('foods')
export class PublicFoodController {
  constructor(private readonly foodService: FoodService) {}

  @Public()
  @HttpCode(200)
  @Get('public-offered')
  @ResponseMessage('Get public offered foods successfully')
  getPublicOfferedFoods(
    @Query() query: string,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.foodService.getPublicOfferedFoods(query, +current, +pageSize);
  }
}
