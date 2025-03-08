import { Public, ResponseMessage } from '@/decorator/customize';
import {
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { VerifyAccountDto } from './dto/verify-account.dto';
import { ResendCodeDto } from './dto/resend-code.dto';
import { RequestWithUser } from '@/common/interfaces/request-with-user.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('Login successfully')
  async handleLogin(@Request() req: RequestWithUser) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('register')
  @ResponseMessage('Register successfully')
  register(@Body() registerDto: CreateAuthDto) {
    return this.authService.handleRegister(registerDto);
  }

  @Public()
  @Post('verify')
  @HttpCode(200)
  @ResponseMessage('Verify account successfully')
  verify(@Body() verifyDto: VerifyAccountDto) {
    return this.authService.verifyAccount(verifyDto);
  }

  @Public()
  @Post('resend-code')
  @HttpCode(200)
  @ResponseMessage('Resend code successfully')
  resendCode(@Body() resendCodeDto: ResendCodeDto) {
    return this.authService.resendCode(resendCodeDto);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(200)
  @ResponseMessage('Recovery account successfully')
  forgotPassword(@Body('email') email: string) {
    return this.authService.sendResetPasswordEmail(email);
  }

  @Public()
  @Post('check-validcode')
  @HttpCode(200)
  @ResponseMessage('Check valid code successfully')
  checkValidCode(@Body('email') email: string, @Body('code') code: string) {
    return this.authService.checkValidCode(code, email);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(200)
  @ResponseMessage('Reset password successfully')
  resetPassword(
    @Body('newPassword') newPass: string,
    @Body('token') token: string,
  ) {
    return this.authService.resetPassword(token, newPass);
  }

  @Post('refresh-token')
  @HttpCode(200)
  @ResponseMessage('Reset password successfully')
  refreshToken(
    @Body('userId') userId: string,
    @Body('refreshToken') refreshToken: string,
  ) {
    return this.authService.handleRefreshToken(userId, refreshToken);
  }

  @Post('logout')
  @ResponseMessage('Logout successfully')
  async logout(@Request() req: any) {
    const userId = req.user._id;
    return this.authService.logout(userId);
  }
}
