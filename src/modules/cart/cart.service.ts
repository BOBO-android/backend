import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { FoodRepository } from '../food/food.repo';
import { convertToObjectId } from '@/helpers';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    private readonly foodRepository: FoodRepository,
  ) {}

  async getCartByUserId(userId: Types.ObjectId) {
    const cart = await this.cartModel.aggregate([
      { $match: { userId } },
      {
        $lookup: {
          from: 'foods',
          localField: 'items.foodId',
          foreignField: '_id',
          as: 'foodDetails',
        },
      },
      { $unwind: '$items' }, // Unwind items to join each one with food
      {
        $lookup: {
          from: 'foods',
          localField: 'items.foodId',
          foreignField: '_id',
          as: 'food',
        },
      },
      { $unwind: '$food' },
      {
        $project: {
          _id: 1,
          userId: 1,
          createdAt: 1,
          updatedAt: 1,
          item: {
            _id: '$items._id',
            foodId: '$food._id',
            name: '$food.name',
            price: '$food.price',
            quantity: '$items.quantity',
          },
        },
      },
      {
        $group: {
          _id: '$_id',
          userId: { $first: '$userId' },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
          items: { $push: '$item' }, // Collect items into an array
        },
      },
    ]);

    return cart.length ? cart[0] : null; // Return the first item (or null if no cart)
  }

  async addToCart(userId: Types.ObjectId, addToCartDto: AddToCartDto) {
    const { foodId, quantity } = addToCartDto;

    // Check if the food exists
    const food = await this.foodRepository.findById(foodId);
    if (!food || !food.isAvailable) {
      throw new NotFoundException('Food item not found or unavailable');
    }

    // Check if the user already has a cart
    let cart = await this.cartModel.findOne({ userId });

    if (!cart) {
      cart = new this.cartModel({ userId, items: [] });
    }

    // Check if the food is already in the cart
    const existingItem = cart.items.find((item) => item.foodId.equals(foodId));

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ foodId: convertToObjectId(foodId), quantity });
    }

    await cart.save();
    return {};
  }

  async updateCartItem(
    userId: Types.ObjectId,
    foodId: string,
    quantity: number,
  ): Promise<object> {
    if (!quantity) throw new BadRequestException('Quantiy is required!');

    const cart = await this.cartModel.findOne({ userId });
    if (!cart) throw new NotFoundException('Cart not found');

    const item = cart.items.find((item) => item.foodId.toString() === foodId);
    if (!item) throw new NotFoundException('Food item not found in cart');

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (item) => item.foodId.toString() !== foodId,
      );
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    return cart.populate('items.foodId', 'name price');
  }

  async removeItem(userId: Types.ObjectId, foodId: string) {
    const cart = await this.cartModel.findOne({ userId });
    if (!cart) throw new NotFoundException('Cart not found');

    const foundCartItem = cart.items.find(
      (item) => item.foodId.toString() === foodId,
    );

    if (!foundCartItem) throw new BadRequestException();

    cart.items = cart.items.filter((item) => item.foodId.toString() !== foodId);

    await cart.save();
    return {};
  }

  async clearCart(userId: Types.ObjectId): Promise<void> {
    await this.cartModel.findOneAndUpdate(
      { userId },
      { $set: { items: [] } },
      { new: true },
    );
  }
}
