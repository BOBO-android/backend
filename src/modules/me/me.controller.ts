import { Body, Controller, Get, Patch, Request } from '@nestjs/common';
import { MeService } from './me.service';
import { Role, Roles } from '@/decorator/roles.decorator';
import { RequestWithUser } from '@/common/interfaces/request-with-user.interface';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from '@/decorator/customize';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiBearerAuth()
@ApiTags('Me') // Gộp các API này thành nhóm "Me" trong Swagger UI
@Roles(Role.User)
@Controller('me')
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Get('base-profile')
  @ApiOperation({ summary: 'Get basic user information' })
  @ResponseMessage('Get base profile successfully')
  async getProfile(@Request() req: RequestWithUser) {
    const userId = req.user._id;
    return this.meService.getProfile(userId);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get full user information' })
  @ResponseMessage('Get profile successfully')
  async getFullProfile(@Request() req: RequestWithUser) {
    const userId = req.user._id;
    return this.meService.getFullProfile(userId);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update user information' })
  @ApiBody({ type: UpdateProfileDto })
  @ResponseMessage('Update profile successfully')
  async updateProfile(
    @Request() req: RequestWithUser,
    @Body() dto: UpdateProfileDto,
  ) {
    const userId = req.user._id;
    return this.meService.updateProfile(userId, dto);
  }
}
