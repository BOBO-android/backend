import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../schemas/order.schema';
import { OrderStatus } from '@/constant';
import { convertToObjectId } from '@/helpers';

@Injectable()
export class StoreOrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
  ) {}

  async getOrdersByStore(
    storeId: string,
    orderStatus?: 'pending' | 'processing',
  ) {
    const query: any = { storeId: convertToObjectId(storeId) };

    if (orderStatus === 'pending') {
      query.status = OrderStatus.PENDING;
    } else if (orderStatus === 'processing') {
      query.status = { $ne: OrderStatus.PENDING };
    }

    const orders = await this.orderModel
      .find(query)
      .sort({ createdAt: -1 })
      .select(
        'userName userImageUrl orderTime totalPrice status deliveryDate deliverTo foodItems',
      )
      .lean();

    if (!orders || orders.length === 0) {
      throw new NotFoundException('No orders found for this store');
    }

    return orders.map((order) => ({
      orderId: order._id.toString(),
      userName: order.userName,
      userImageUrl: order.userImageUrl,
      orderTime: order.orderTime,
      totalPrice: order.totalPrice,
      orderStatus: order.status,
      deliveryDate: order.deliveryDate,
      deliverTo: order.deliverTo,
      foodItems: order.foodItems.map((item) => ({
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
        quantity: item.quantity,
      })),
    }));
  }
}
