import { Body, Controller, HttpCode, Post, Request } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { ResponseMessage } from '@/decorator/customize';
import { RequestWithUser } from '@/common/interfaces/request-with-user.interface';
import { VerifyStoreDto } from './dto/verify-store.dto';
import { ResendCodeDto } from './dto/resend-code.dto';

@ApiTags('Stores') // Group under "Stores" in Swagger UI
@ApiBearerAuth() // Requires Bearer Token Authentication
@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @ApiOperation({ summary: 'Register a new store' })
  @ApiResponse({ status: 201, description: 'Register store successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: CreateStoreDto }) // Defines the expected request body
  @Post('register')
  @ResponseMessage('Register store successfully')
  async registerStore(
    @Request() req: RequestWithUser,
    @Body() createStoreDto: CreateStoreDto,
  ) {
    const userId = req.user._id;
    return this.storeService.registerStore(createStoreDto, userId);
  }

  @ApiOperation({ summary: 'Verify a store' })
  @ApiResponse({ status: 200, description: 'Verify store successfully' })
  @ApiResponse({ status: 400, description: 'Invalid verification code' })
  @ApiBody({ type: VerifyStoreDto }) // Defines request body format for verification
  @HttpCode(200)
  @Post('verify')
  @ResponseMessage('Verify store successfully')
  verify(@Request() req: RequestWithUser, @Body() verifyDto: VerifyStoreDto) {
    const userId = req.user._id;
    return this.storeService.verifyStore(verifyDto, userId);
  }

  @ApiOperation({ summary: 'Resend verification code' })
  @ApiResponse({ status: 200, description: 'Resend code successfully' })
  @ApiResponse({ status: 400, description: 'Failed to resend code' })
  @ApiBody({ type: ResendCodeDto }) // Defines request body for resending the code
  @Post('resend-code')
  @HttpCode(200)
  @ResponseMessage('Resend code successfully')
  resendCode(
    @Request() req: RequestWithUser,
    @Body() resendCodeDto: ResendCodeDto,
  ) {
    const userId = req.user._id;
    return this.storeService.resendCode(resendCodeDto, userId);
  }
}
