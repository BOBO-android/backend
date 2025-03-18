import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { Role, Roles } from '@/decorator/roles.decorator';
import { ResponseMessage } from '@/decorator/customize';
import { UpdateStoreStatusDto } from './dto/update-store-status.dto';

@Roles(Role.Admin)
@ApiBearerAuth()
@ApiTags('Admin') // Grouping in Swagger UI
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stores')
  @HttpCode(200)
  @ResponseMessage('Get all store successfully')
  @ApiOperation({
    summary: 'Get all stores',
    description: 'Retrieve a paginated list of stores',
  })
  @ApiQuery({
    name: 'query',
    required: false,
    description: 'Search query (optional)',
  })
  @ApiQuery({
    name: 'current',
    required: true,
    default: 1,
    description: 'Current page number',
  })
  @ApiQuery({
    name: 'pageSize',
    required: true,
    default: 10,
    description: 'Number of items per page',
  })
  @ApiResponse({ status: 200, description: 'Successful response' })
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
  @ApiOperation({
    summary: 'Update store status',
    description: 'Change the status of a specific store',
  })
  @ApiParam({
    name: 'storeId',
    required: true,
    description: 'Unique ID of the store',
  })
  @ApiBody({
    description: 'Update store status',
    type: UpdateStoreStatusDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Store status updated successfully',
  })
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
