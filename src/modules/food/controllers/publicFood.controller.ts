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
    description: 'Retrieve a paginated list of public offered foods',
  })
  @ApiQuery({
    name: 'query',
    required: false,
    description: 'Search query (optional)',
  })
  @ApiQuery({
    name: 'current',
    required: true,
    default: 1,
    description: 'Current page number',
  })
  @ApiQuery({
    name: 'pageSize',
    required: true,
    default: 10,
    description: 'Number of items per page',
  })
  @ApiResponse({ status: 200, description: 'List of public offered foods' })
  getPublicOfferedFoods(
    @Query() query: string,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.foodService.getPublicOfferedFoods(query, +current, +pageSize);
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
