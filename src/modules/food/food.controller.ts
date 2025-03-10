import { FoodService } from './food.service';
import { CreateFoodDto } from './dto/create-food.dto';
import {
  Controller,
  Post,
  Body,
  HttpCode,
  Request,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ResponseMessage } from '@/decorator/customize';
import { Role, Roles } from '@/decorator/roles.decorator';
import { RequestWithUser } from '@/common/interfaces/request-with-user.interface';

@Roles(Role.Shop)
@Controller('stores')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Post('foods')
  @HttpCode(200)
  @ResponseMessage('Create food successfully')
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
}
