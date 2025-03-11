import { Module } from '@nestjs/common';
import { FoodService } from './food.service';
import { FoodController } from './controllers/food.controller';
import { Food, FoodSchema } from './schemas/food.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreModule } from '../store/store.module';
import { PublicFoodController } from './controllers/publicFood.controller';
import { FoodRepository } from './food.repo';

@Module({
  imports: [
    StoreModule,
    MongooseModule.forFeature([{ name: Food.name, schema: FoodSchema }]),
  ],
  controllers: [FoodController, PublicFoodController],
  providers: [FoodService, FoodRepository],
  exports: [FoodRepository],
})
export class FoodModule {}
