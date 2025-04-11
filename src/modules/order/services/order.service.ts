import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { OrderStatus } from '@/constant';
import { convertToObjectId } from '@/helpers';
import { Order } from '../schemas/order.schema';
import { CartService } from '@/modules/cart/cart.service';
import { UsersService } from '@/modules/users/users.service';
import { Food, FoodDocument } from '@/modules/food/schemas/food.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private readonly cartService: CartService,
    private readonly usersService: UsersService,
    @InjectModel(Food.name) private foodModel: Model<FoodDocument>,
  ) {}

  async createOrder(
    userId: Types.ObjectId,
    paymentMethod: string,
  ): Promise<Order> {
    // Get the user's cart
    const cart = await this.cartService.getCartByUserId(userId);
    if (!cart || cart.items.length === 0)
      throw new NotFoundException('Cart is empty');

    // Lấy thông tin user
    const user = await this.usersService.findByIdLean(userId.toString());
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Lấy thông tin chi tiết các món ăn từ Food collection
    const foodIds = cart.items.map((item) => item.foodId);
    const foods = await this.foodModel
      .find({ _id: { $in: foodIds } })
      .select('name price thumbnail storeId')
      .lean();

    // Check and build foodItems in schema format
    const foodItems = cart.items.map((cartItem: any) => {
      const food = foods.find(
        (f) => f._id.toString() === cartItem.foodId.toString(),
      );
      if (!food) {
        throw new NotFoundException(
          `Food item with ID ${cartItem.foodId} not found`,
        );
      }

      return {
        foodId: food._id,
        name: food.name,
        price: food.price,
        imageUrl: food.thumbnail,
        quantity: cartItem.quantity,
      };
    });

    const totalPrice = foodItems.reduce((sum: number, item: any) => {
      return sum + item.price * item.quantity;
    }, 0);

    const storeId = foods[0].storeId;

    // Create a new order
    const order = new this.orderModel({
      userId,
      storeId,
      userName: user.fullName,
      userImageUrl: user.image,
      orderTime: new Date(),
      deliverTo: user.address || 'N/A',
      deliveryDate: null, // hoặc bạn có logic để tính ngày giao dự kiến
      totalPrice,
      status: OrderStatus.PENDING,
      paymentMethod,
      foodItems,
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

    const orders = await this.orderModel.find({ userId }).lean();

    return orders;
  }

  async getOrderById(orderId: string, ownerId: Types.ObjectId) {
    if (!Types.ObjectId.isValid(orderId)) {
      throw new NotFoundException('Invalid order ID');
    }

    const order = await this.orderModel
      .findOne({ _id: convertToObjectId(orderId), userId: ownerId })
      .populate<{
        userId: { _id: Types.ObjectId; name: string; email: string };
      }>('userId', 'name email')
      .populate('foodItems.foodId', 'name price thumbnail')
      .populate<{
        storeId: { _id: Types.ObjectId; phoneNumber: string };
      }>('storeId', 'phoneNumber')
      .lean();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { foodItems, userId, storeId, ...rest } = order;

    // Transform response: Flatten food details out of `foodId`
    const transformedOrder = {
      ...rest,
      userId: order.userId._id,
      storeId: storeId._id,
      userEmail: order.userId.email,
      storePhoneNumber: order.storeId.phoneNumber,
      items: order.foodItems.map((item) => ({
        ...item,
        ...item.foodId,
        foodId: item.foodId._id,
      })),
    };

    return transformedOrder;
  }
}
