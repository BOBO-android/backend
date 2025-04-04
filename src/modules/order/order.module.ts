import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order, OrderSchema } from './schemas/order.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    CartModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
