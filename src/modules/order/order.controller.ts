import { Controller, Post, Body, Request } from '@nestjs/common';
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
}
