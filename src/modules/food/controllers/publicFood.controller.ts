import { FoodService } from '../food.service';
import { Controller, Get, Query, HttpCode, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { Public, ResponseMessage } from '@/decorator/customize';
import { SearchFoodDto } from '../dto/search-food.dto';

@Public()
@ApiTags('Public Foods') // Grouping in Swagger UI
@Controller('foods')
export class PublicFoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get('public-offered')
  @HttpCode(200)
  @ResponseMessage('Get public offered foods successfully')
  @ApiOperation({
    summary: 'Get public offered foods',
    description:
      'Retrieve a list of public offered foods using cursor-based pagination',
  })
  @ApiQuery({
    name: 'lastId',
    required: false,
    description: 'ID of the last item from previous fetch (for pagination)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items to fetch per page (default: 10)',
  })
  @ApiResponse({ status: 200, description: 'List of public offered foods' })
  async getPublicOfferedFoods(
    @Query('lastId') lastId?: string,
    @Query('limit') limit?: string,
  ) {
    return this.foodService.getPublicOfferedFoods(lastId, +(limit ?? 10));
  }

  @Get(':slug')
  @HttpCode(200)
  @ResponseMessage('Get public food successfully')
  @ApiOperation({
    summary: 'Get a public food item',
    description: 'Retrieve a specific food item by its slug',
  })
  @ApiParam({
    name: 'slug',
    required: true,
    description: 'Slug of the food item',
  })
  @ApiResponse({ status: 200, description: 'Food item details' })
  getPublicFood(@Param('slug') slug: string) {
    return this.foodService.findBySlug(slug);
  }

  @Get()
  @HttpCode(200)
  @ResponseMessage('Get foods successfully')
  @ApiOperation({
    summary: 'Search foods',
    description: 'Search for foods by query',
  })
  @ApiQuery({ name: 'query', required: true, description: 'Search query' })
  @ApiResponse({ status: 200, description: 'Search results' })
  searchFoods(@Query() searchFoodDto: SearchFoodDto) {
    return this.foodService.searchFoods(searchFoodDto.query);
  }
}
