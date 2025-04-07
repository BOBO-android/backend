import { Controller, Get, Param, Query } from '@nestjs/common';
import { StoreOrderService } from '../services/storeOrder.service';
import { Role, Roles } from '@/decorator/roles.decorator';

@Controller('stores/orders')
@Roles(Role.Shop)
export class StoreOrderController {
  constructor(private readonly storeOrderService: StoreOrderService) {}

  @Get('/:storeId')
  getOrdersByStore(
    @Param('storeId') storeId: string,
    @Query('orderStatus') orderStatus?: 'pending' | 'processing',
  ) {
    return this.storeOrderService.getOrdersByStore(storeId, orderStatus);
  }
}
