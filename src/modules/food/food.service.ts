import { Model, Types } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Food, FoodDocument } from './schemas/food.schema';
import { CreateFoodDto } from './dto/create-food.dto';
import { StoreService } from '../store/store.service';
import { convertToObjectId } from '@/helpers';
import aqp from 'api-query-params';
import { UpdateFoodDto } from './dto/update-food.dto';

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

  async getFoodsByStore(
    storeId: string,
    ownerId: Types.ObjectId,
    query: string,
    current: number = 1,
    pageSize: number = 10,
  ) {
    if (!Types.ObjectId.isValid(storeId)) {
      throw new NotFoundException('Invalid store ID');
    }

    // Validate if the store belongs to the owner
    const foundStore = await this.storeService.findByOwnerId(
      ownerId.toString(),
    );
    if (!foundStore || foundStore._id.toString() !== storeId) {
      throw new BadRequestException('Store does not belong to the owner');
    }

    // Parse query parameters
    const { filter, sort } = aqp(query);
    delete filter.current;
    delete filter.pageSize;

    // Ensure pagination values are valid
    current = Math.max(1, current);
    pageSize = Math.max(1, pageSize);

    // Count total items efficiently
    const totalItems = await this.foodModel.countDocuments({
      ...filter,
      storeId: convertToObjectId(storeId),
    });

    // Calculate total pages
    const totalPage = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * pageSize;

    // Fetch paginated foods
    const foods = await this.foodModel
      .find({ ...filter, storeId: convertToObjectId(storeId) })
      .sort(sort as any)
      .skip(skip)
      .limit(pageSize)
      .exec();

    return { foods, totalPage, totalItems, current };
  }

  async updateFood(
    storeId: string,
    foodId: string,
    ownerId: Types.ObjectId,
    updateFoodDto: UpdateFoodDto,
  ) {
    if (!Types.ObjectId.isValid(storeId) || !Types.ObjectId.isValid(foodId)) {
      throw new NotFoundException('Invalid store or food ID');
    }

    // Validate store ownership
    const foundStore = await this.storeService.findByOwnerId(
      ownerId.toString(),
    );
    if (!foundStore || foundStore._id.toString() !== storeId) {
      throw new BadRequestException('Store does not belong to the owner');
    }

    // Find food in store
    const food = await this.foodModel.findOne({
      _id: convertToObjectId(foodId),
      storeId: convertToObjectId(storeId),
    });
    if (!food) throw new NotFoundException('Food item not found');

    // Update food
    const updatedFood = await this.foodModel.findByIdAndUpdate(
      foodId,
      updateFoodDto,
      { new: true, runValidators: true },
    );

    return updatedFood;
  }
}
