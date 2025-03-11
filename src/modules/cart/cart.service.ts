import { Injectable, NotFoundException } from '@nestjs/common';
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
}
