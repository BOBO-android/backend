import { Module } from '@nestjs/common';
import { OrderController } from './controllers/order.controller';
import { Order, OrderSchema } from './schemas/order.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CartModule } from '../cart/cart.module';
import { OrderService } from './services/order.service';
import { StoreOrderController } from './controllers/storeOrder.controller';
import { StoreOrderService } from './services/storeOrder.service';
import { UsersModule } from '../users/users.module';
import { FoodModule } from '../food/food.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    CartModule,
    UsersModule,
    FoodModule,
  ],
  controllers: [OrderController, StoreOrderController],
  providers: [OrderService, StoreOrderService],
})
export class OrderModule {}
