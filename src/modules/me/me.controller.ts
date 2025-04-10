import { Controller, Get, Request } from '@nestjs/common';
import { MeService } from './me.service';
import { Role, Roles } from '@/decorator/roles.decorator';
import { RequestWithUser } from '@/common/interfaces/request-with-user.interface';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ResponseMessage } from '@/decorator/customize';

@ApiBearerAuth() // Add Bearer Token Authentication globally
@Roles(Role.User)
@Controller('me')
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Get('base-profile')
  @ResponseMessage('Get base profile successfully')
  async getProfile(@Request() req: RequestWithUser) {
    const userId = req.user._id;
    return this.meService.getProfile(userId);
  }
}
