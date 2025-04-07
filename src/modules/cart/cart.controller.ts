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
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CartService } from './cart.service';
import { ResponseMessage } from '@/decorator/customize';
import { RequestWithUser } from '@/common/interfaces/request-with-user.interface';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { Role, Roles } from '@/decorator/roles.decorator';

@ApiTags('Cart') // Swagger grouping
@ApiBearerAuth()
@Roles(Role.User)
@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @HttpCode(200)
  @ResponseMessage('Cart retrieved successfully')
  @ApiOperation({
    summary: 'Get user cart',
    description: 'Retrieve the cart of the logged-in user',
  })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully' })
  async getCart(@Request() req: RequestWithUser) {
    const userId = req.user._id;
    return this.cartService.getCartByUserId(userId);
  }

  @Post()
  @HttpCode(200)
  @ResponseMessage('Added to cart successfully')
  @ApiOperation({
    summary: 'Add item to cart',
    description: 'Add an item to the user’s cart',
  })
  @ApiBody({ type: AddToCartDto })
  @ApiResponse({ status: 200, description: 'Item added to cart successfully' })
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
  @ApiOperation({
    summary: 'Update cart item quantity',
    description: 'Update the quantity of an item in the cart',
  })
  @ApiParam({
    name: 'foodId',
    required: true,
    description: 'ID of the food item',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        quantity: {
          type: 'number',
          example: 2,
          description: 'New quantity of the item',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Cart item updated successfully' })
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
  @ApiOperation({
    summary: 'Remove item from cart',
    description: 'Remove an item from the user’s cart',
  })
  @ApiParam({
    name: 'foodId',
    required: true,
    description: 'ID of the food item',
  })
  @ApiResponse({
    status: 200,
    description: 'Item removed from cart successfully',
  })
  async removeItemFromCart(
    @Request() req: RequestWithUser,
    @Param('foodId') foodId: string,
  ) {
    const userId = req.user._id;
    return this.cartService.removeItem(userId, foodId);
  }
}
