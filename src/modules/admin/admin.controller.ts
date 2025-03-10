import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Role, Roles } from '@/decorator/roles.decorator';
import { ResponseMessage } from '@/decorator/customize';
import { UpdateStoreStatusDto } from './dto/update-store-status.dto';

@Roles(Role.Admin)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stores')
  @HttpCode(200)
  @ResponseMessage('Get all store successfully')
  async getAllStores(
    @Query() query: string,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.adminService.findAll(query, +current, +pageSize);
  }

  @HttpCode(200)
  @Patch('/stores/:storeId/status')
  @ResponseMessage('Store status updated successfully')
  async updateStoreStatus(
    @Param('storeId') storeId: string,
    @Body() updateStoreStatusDto: UpdateStoreStatusDto,
  ) {
    return await this.adminService.updateStatus(
      storeId,
      updateStoreStatusDto.status,
    );
  }
}
