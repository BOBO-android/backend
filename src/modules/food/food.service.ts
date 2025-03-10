import { Model, Types } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Food, FoodDocument } from './schemas/food.schema';
import { CreateFoodDto } from './dto/create-food.dto';
import { StoreService } from '../store/store.service';

@Injectable()
export class FoodService {
  constructor(
    @InjectModel(Food.name) private foodModel: Model<FoodDocument>,
    private readonly storeService: StoreService,
  ) {}

  async create(
    createFoodDto: CreateFoodDto,
    ownerId: Types.ObjectId,
  ): Promise<Food> {
    const foundStore = await this.storeService.findByOwnerId(
      ownerId.toString(),
    );
    if (!foundStore) throw new BadRequestException();
    if (foundStore._id.toString() !== createFoodDto.storeId)
      throw new BadRequestException();
    const newFood = new this.foodModel({
      ...createFoodDto,
      storeId: foundStore._id,
    });
    return newFood.save();
  }
}
