import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Query,
  Request,
} from '@nestjs/common';
import { StoreOrderService } from '../services/storeOrder.service';
import { Role, Roles } from '@/decorator/roles.decorator';
import { UpdateOrderStatusDto } from '../dto/UpdateOrderStatusDto';
import { RequestWithUser } from '@/common/interfaces/request-with-user.interface';
import { ResponseMessage } from '@/decorator/customize';

@Controller('stores/orders')
@Roles(Role.Shop)
export class StoreOrderController {
  constructor(private readonly storeOrderService: StoreOrderService) {}

  @Get('/:storeId')
  @HttpCode(200)
  @ResponseMessage('Retrive orders successfully')
  getOrdersByStore(
    @Param('storeId') storeId: string,
    @Query('orderStatus') orderStatus?: 'pending' | 'processing',
  ) {
    return this.storeOrderService.getOrdersByStore(storeId, orderStatus);
  }

  @Patch('/:storeId/:orderId/status')
  @HttpCode(200)
  @ResponseMessage('Update status order successfully')
  updateOrderStatus(
    @Param('storeId') storeId: string,
    @Param('orderId') orderId: string,
    @Body() body: UpdateOrderStatusDto,
    @Request() req: RequestWithUser,
  ) {
    const ownerId = req.user._id;
    return this.storeOrderService.updateOrderStatus(
      storeId,
      orderId,
      body.status,
      ownerId,
    );
  }
}
