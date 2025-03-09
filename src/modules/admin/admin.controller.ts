import { Controller, Get, HttpCode, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Role, Roles } from '@/decorator/roles.decorator';
import { ResponseMessage } from '@/decorator/customize';

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
}
