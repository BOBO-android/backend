import { FoodService } from './food.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { Controller, Post, Body, HttpCode, Request } from '@nestjs/common';
import { ResponseMessage } from '@/decorator/customize';
import { Role, Roles } from '@/decorator/roles.decorator';
import { RequestWithUser } from '@/common/interfaces/request-with-user.interface';

@Roles(Role.Shop)
@Controller('stores/foods')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Post()
  @HttpCode(200)
  @ResponseMessage('Create food successfully')
  create(
    @Request() req: RequestWithUser,
    @Body() createFoodDto: CreateFoodDto,
  ) {
    const userId = req.user._id;
    return this.foodService.create(createFoodDto, userId);
  }
}
