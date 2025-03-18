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
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Orders') // Group all order endpoints under "Orders" in Swagger
@ApiBearerAuth() // Require JWT authentication in Swagger UI
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ResponseMessage('Create order successfully')
  @ApiOperation({
    summary: 'Create a new order',
    description: 'Creates an order for the authenticated user.',
  })
  @ApiBody({ type: CreateOrderDto }) // Document request body
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
  @ApiOperation({
    summary: 'Get all orders for a user',
    description: 'Retrieves a list of orders for the authenticated user.',
  })
  @ApiQuery({
    name: 'customerId',
    required: false,
    description: 'Optional customer ID to filter orders',
  }) // 🔹 Document query parameter
  async getOrdersByUser(
    @Request() req: RequestWithUser,
    @Query('customerId') customerId?: string, // Optional query param
  ) {
    const userId = req.user._id;
    return this.orderService.getOrdersByUser(customerId, userId);
  }

  @Get(':orderId')
  @HttpCode(200)
  @ResponseMessage('Get order successfully')
  @ApiOperation({
    summary: 'Get a specific order',
    description: 'Retrieves the details of a specific order by ID.',
  })
  @ApiParam({
    name: 'orderId',
    required: true,
    description: 'The ID of the order to retrieve',
  }) // 🔹 Document path parameter
  async getOrder(
    @Request() req: RequestWithUser,
    @Param('orderId') orderId: string,
  ) {
    const userId = req.user._id;
    return await this.orderService.getOrderById(orderId, userId);
  }
}
