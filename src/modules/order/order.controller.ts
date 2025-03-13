import {
  Controller,
  Post,
  Body,
  Request,
  HttpCode,
  Get,
  Query,
  Param,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { RequestWithUser } from '@/common/interfaces/request-with-user.interface';
import { ResponseMessage } from '@/decorator/customize';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ResponseMessage('Create order successfully')
  async createOrder(
    @Request() req: RequestWithUser,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    const userId = req.user._id;
    return this.orderService.createOrder(userId, createOrderDto.paymentMethod);
  }

  @Get()
  @HttpCode(200)
  @ResponseMessage('Get all orders successfully')
  async getOrdersByUser(
    @Request() req: RequestWithUser,
    @Query('customerId') customerId: string,
  ) {
    const userId = req.user._id;
    return this.orderService.getOrdersByUser(customerId, userId);
  }

  @Get(':orderId')
  @HttpCode(200)
  @ResponseMessage('Get order successfully')
  async getOrder(
    @Request() req: RequestWithUser,
    @Param('orderId') orderId: string,
  ) {
    const userId = req.user._id;
    return await this.orderService.getOrderById(orderId, userId);
  }
}
