import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { ResponseMessage } from '@/decorator/customize';
import { RequestWithUser } from '@/common/interfaces/request-with-user.interface';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @HttpCode(200)
  @ResponseMessage('Cart retrieved successfully')
  async getCart(@Request() req: RequestWithUser) {
    const userId = req.user._id;
    return this.cartService.getCartByUserId(userId);
  }

  @Post()
  @HttpCode(200)
  @ResponseMessage('Added to cart successfully')
  addToCart(
    @Request() req: RequestWithUser,
    @Body() addToCartDto: AddToCartDto,
  ) {
    const userId = req.user._id;
    return this.cartService.addToCart(userId, addToCartDto);
  }

  @Patch('items/:foodId')
  @HttpCode(200)
  @ResponseMessage('Cart item updated successfully')
  async updateCartItem(
    @Request() req: RequestWithUser,
    @Param('foodId') foodId: string,
    @Body('quantity') quantity: number,
  ) {
    const userId = req.user._id;
    return this.cartService.updateCartItem(userId, foodId, quantity);
  }

  @Delete('items/:foodId')
  @HttpCode(200)
  @ResponseMessage('Item removed from cart successfully')
  async removeItemFromCart(
    @Request() req: RequestWithUser,
    @Param('foodId') foodId: string,
  ) {
    const userId = req.user._id;
    return this.cartService.removeItem(userId, foodId);
  }
}
