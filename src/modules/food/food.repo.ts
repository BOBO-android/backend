import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Food, FoodDocument } from './schemas/food.schema';

@Injectable()
export class FoodRepository {
  constructor(@InjectModel(Food.name) private foodModel: Model<FoodDocument>) {}

  async findById(foodId: string): Promise<Food | null> {
    return this.foodModel.findById(foodId);
  }

  async findAvailableById(foodId: string): Promise<Food | null> {
    return this.foodModel.findOne({ _id: foodId, isAvailable: true });
  }
}
