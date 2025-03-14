import { FoodService } from '../food.service';
import { CreateFoodDto } from '../dto/create-food.dto';
import { UpdateFoodDto } from '../dto/update-food.dto';
import { ResponseMessage } from '@/decorator/customize';
import { Role, Roles } from '@/decorator/roles.decorator';
import { RequestWithUser } from '@/common/interfaces/request-with-user.interface';
import {
  Controller,
  Post,
  Body,
  HttpCode,
  Request,
  Get,
  Param,
  Query,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Foods') // Group this controller under 'Foods' in Swagger
@ApiBearerAuth() // Add Bearer Token Authentication globally
@Roles(Role.Shop)
@Controller('stores')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Post('foods')
  @HttpCode(200)
  @ResponseMessage('Create food successfully')
  @ApiOperation({ summary: 'Create a new food item' })
  @ApiResponse({ status: 200, description: 'Food created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: CreateFoodDto }) // Attach DTO for Swagger UI
  create(
    @Request() req: RequestWithUser,
    @Body() createFoodDto: CreateFoodDto,
  ) {
    const userId = req.user._id;
    return this.foodService.create(createFoodDto, userId);
  }

  @Get(':storeId/foods')
  @HttpCode(200)
  @ResponseMessage('Get all foods successfully')
  @ApiOperation({ summary: 'Get all foods for a specific store' })
  @ApiResponse({
    status: 200,
    description: 'List of foods retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiParam({ name: 'storeId', required: true, description: 'Store ID' })
  @ApiQuery({
    name: 'current',
    required: false,
    type: String,
    description: 'Current page',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: String,
    description: 'Items per page',
  })
  getAllDishes(
    @Request() req: RequestWithUser,
    @Param('storeId') storeId: string,
    @Query() query: string,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
  ) {
    const userId = req.user._id;
    return this.foodService.getFoodsByStore(
      storeId,
      userId,
      query,
      +current,
      +pageSize,
    );
  }

  @Patch(':storeId/foods/:foodId')
  @ResponseMessage('Food updated successfully')
  @ApiOperation({ summary: 'Update food details' })
  @ApiResponse({ status: 200, description: 'Food updated successfully' })
  @ApiResponse({ status: 404, description: 'Food not found' })
  @ApiParam({ name: 'storeId', required: true, description: 'Store ID' })
  @ApiParam({ name: 'foodId', required: true, description: 'Food ID' })
  @ApiBody({ type: UpdateFoodDto })
  updateFood(
    @Request() req: RequestWithUser,
    @Param('storeId') storeId: string,
    @Param('foodId') foodId: string,
    @Body() updateFoodDto: UpdateFoodDto,
  ) {
    const ownerId = req.user._id;
    return this.foodService.updateFood(storeId, foodId, ownerId, updateFoodDto);
  }

  @Delete(':storeId/foods/:foodId')
  @ResponseMessage('Food deleted successfully')
  @ApiOperation({ summary: 'Soft delete a food item' })
  @ApiResponse({ status: 200, description: 'Food deleted successfully' })
  @ApiResponse({ status: 404, description: 'Food not found' })
  @ApiParam({ name: 'storeId', required: true, description: 'Store ID' })
  @ApiParam({ name: 'foodId', required: true, description: 'Food ID' })
  softDeleteFood(
    @Request() req: RequestWithUser,
    @Param('storeId') storeId: string,
    @Param('foodId') foodId: string,
  ) {
    const ownerId = req.user._id;
    return this.foodService.softDeleteFood(storeId, foodId, ownerId);
  }
}
