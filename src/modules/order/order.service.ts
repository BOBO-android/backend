import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CartService } from '../cart/cart.service';
import { Order } from './schemas/order.schema';
import { OrderStatus } from '@/constant';
import { convertToObjectId } from '@/helpers';

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

  async getOrdersByUser(userId: string, ownerId: Types.ObjectId) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID format');
    }

    if (userId !== ownerId.toString()) throw new BadRequestException();

    const orders = await this.orderModel
      .find({ userId })
      .populate({
        path: 'items.foodId', // Populate 'foodId'
        select: 'name price thumbnail', // Select required fields
        model: 'Food', // Ensure it pulls from the 'Food' collection
      })
      .lean();

    // Transform the response to remove "foodId" and extract its fields into "items"
    const transformedOrders = orders.map((order) => ({
      ...order,
      items: order.items.map((item: any) => ({
        foodId: item.foodId._id,
        name: item.foodId.name,
        price: item.foodId.price,
        thumbnail: item.foodId.thumbnail,
        quantity: item.quantity,
      })),
    }));

    return transformedOrders;
  }

  async getOrderById(orderId: string, ownerId: Types.ObjectId) {
    if (!Types.ObjectId.isValid(orderId)) {
      throw new NotFoundException('Invalid order ID');
    }

    const order = await this.orderModel
      .findOne({ _id: convertToObjectId(orderId), userId: ownerId })
      .populate<{
        userId: { _id: Types.ObjectId; name: string; email: string };
      }>('userId', 'name email') // Populate user details
      .populate('items.foodId', 'name price thumbnail') // Populate food details
      .lean();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Transform response: Flatten food details out of `foodId`
    const transformedOrder = {
      ...order,
      userId: order.userId._id,
      userEmail: order.userId.email,
      items: order.items.map((item) => ({
        ...item,
        ...item.foodId, // Spread food details
        foodId: item.foodId._id, // Keep only food ID
      })),
    };

    return transformedOrder;
  }

  private calculateTotal(items: Iitem[]): number {
    let total = 0;
    for (const item of items) {
      total += item.price * item.quantity;
    }
    return total;
  }
}
