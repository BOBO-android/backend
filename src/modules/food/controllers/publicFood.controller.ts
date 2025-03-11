import { FoodService } from '../food.service';
import { Controller, Get, Query, HttpCode, Param } from '@nestjs/common';
import { Public, ResponseMessage } from '@/decorator/customize';
import { SearchFoodDto } from '../dto/search-food.dto';

@Public()
@Controller('foods')
export class PublicFoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get('public-offered')
  @HttpCode(200)
  @ResponseMessage('Get public offered foods successfully')
  getPublicOfferedFoods(
    @Query() query: string,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.foodService.getPublicOfferedFoods(query, +current, +pageSize);
  }

  @Get(':slug')
  @HttpCode(200)
  @ResponseMessage('Get public offered foods successfully')
  getPublicFood(@Param('slug') slug: string) {
    return this.foodService.findBySlug(slug);
  }

  @Get()
  @HttpCode(200)
  @ResponseMessage('Get foods successfully')
  searchFoods(@Query() searchFoodDto: SearchFoodDto) {
    return this.foodService.searchFoods(searchFoodDto.query);
  }
}
