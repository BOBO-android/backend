import { Body, Controller, HttpCode, Post, Request } from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { ResponseMessage } from '@/decorator/customize';
import { RequestWithUser } from '@/common/interfaces/request-with-user.interface';
import { VerifyStoreDto } from './dto/verify-store.dto';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post('register')
  @ResponseMessage('Register store successfully')
  async registerStore(
    @Request() req: RequestWithUser,
    @Body() createStoreDto: CreateStoreDto,
  ) {
    const userId = req.user._id;
    return this.storeService.registerStore(createStoreDto, userId);
  }

  @HttpCode(200)
  @Post('verify')
  @ResponseMessage('Verify store successfully')
  verify(@Request() req: RequestWithUser, @Body() verifyDto: VerifyStoreDto) {
    const userId = req.user._id;
    return this.storeService.verifyStore(verifyDto, userId);
  }
}
