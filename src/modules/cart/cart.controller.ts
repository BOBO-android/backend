import { Body, Controller, HttpCode, Post, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { ResponseMessage } from '@/decorator/customize';
import { RequestWithUser } from '@/common/interfaces/request-with-user.interface';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

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
}
