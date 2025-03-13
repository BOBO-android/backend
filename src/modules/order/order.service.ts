import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CartService } from '../cart/cart.service';
import { Order } from './schemas/order.schema';
import { OrderStatus } from '@/constant';

interface Iitem {
  _id: Types.ObjectId;
  foodId: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private readonly cartService: CartService,
  ) {}

  async createOrder(
    userId: Types.ObjectId,
    paymentMethod: string,
  ): Promise<Order> {
    // Get the user's cart
    const cart = await this.cartService.getCartByUserId(userId);
    if (!cart || cart.items.length === 0)
      throw new NotFoundException('Cart is empty');

    // Create a new order
    const order = new this.orderModel({
      userId,
      items: cart.items,
      totalPrice: this.calculateTotal(cart.items),
      status: OrderStatus.PENDING,
      paymentMethod,
    });

    await order.save();

    // Clear the cart after placing an order
    await this.cartService.clearCart(userId);

    return order;
  }

  private calculateTotal(items: Iitem[]): number {
    let total = 0;
    for (const item of items) {
      total += item.price * item.quantity;
    }
    return total;
  }
}
