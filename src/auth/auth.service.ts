import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { VerifyAccountDto } from './dto/verify-account.dto';
import { UsersService } from '@/modules/users/users.service';
import { comparePassword, hashPassword } from '@/helpers';
import { UserType } from './auth';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';
import dayjs from 'dayjs';
import { ResendCodeDto } from './dto/resend-code.dto';
import { RedisService } from '@/modules/redis/redis.service';
import { MailerService } from '@nestjs-modules/mailer';
import { generateCode } from '@/utils';
import { TokenService } from '@/modules/token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
    private jwtService: JwtService,
    private redisService: RedisService,
    private readonly mailerService: MailerService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail({ email });
    if (!user) return null;

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) return null;

    return user;
  }

  async login(user: UserType) {
    const { _id, email, username } = user;
    const payload = { email, sub: _id };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '30m', // Expiration for accessToken
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1d', // Expiration for refreshToken
    });

    // Store refreshToken in the database
    await this.tokenService.create({ userId: _id, refreshToken });

    return {
      user: {
        _id,
        email,
        username,
      },
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async handleRegister(registerDto: CreateAuthDto) {
    return await this.usersService.handleRegister(registerDto);
  }

  async logout(userId: string) {
    const hasUser = await this.usersService.findOneById(userId);
    if (!hasUser) throw new BadRequestException('User not found');

    const hasToken = await this.tokenService.findOneByUserId(userId);
    if (!hasToken) throw new BadRequestException('User is already logged out');

    // Delete the refresh token
    await hasToken.deleteOne();

    return {};
  }

  async verifyAccount(verifyAccountDto: VerifyAccountDto) {
    const { username, codeId } = verifyAccountDto;

    const foundUser = await this.usersService.findOneByUsername(username);
    if (!foundUser) throw new BadRequestException();

    if (codeId !== foundUser.codeId)
      throw new BadRequestException('The code invalid or expried!');
    if (!dayjs().isBefore(foundUser.codeExpired))
      throw new BadRequestException('The code invalid or expried!');

    await foundUser.updateOne({ isActive: true });

    return {};
  }

  async resendCode(resendCodeDto: ResendCodeDto) {
    return this.usersService.resendCode(resendCodeDto);
  }

  async sendResetPasswordEmail(email: string) {
    const TIME_ONE_HOUR = 3600;
    const foundUser = await this.usersService.findByEmail({ email });
    if (!foundUser)
      throw new BadRequestException('User with this email does not exist.');

    const code = generateCode();
    const ttl = TIME_ONE_HOUR; // code expiration time in seconds (1 hour)

    // Cache code in Redis
    await this.redisService.set(`reset-password:${email}`, code, ttl);

    // Send mail
    this.mailerService.sendMail({
      to: foundUser.email, // List to reciver
      subject: 'BoBo Password Reset', // Subject line
      template: 'forgotPassword',
      context: {
        name: foundUser?.username ?? foundUser?.email,
        resetCode: code,
      },
    });

    return { message: 'Password reset email sent.' };
  }

  async checkValidCode(code: string, email: string) {
    const TIME_ONE_HOUR = 3600;
    if (!code) throw new BadRequestException('Invalid or expired code.');

    const cachedCode = await this.redisService.get(`reset-password:${email}`);
    if (!cachedCode || cachedCode !== code)
      throw new BadRequestException('Invalid or expired code.');

    const token = this.jwtService.sign({ email });
    const ttl = TIME_ONE_HOUR;

    // Delete code has use in Redis
    await this.redisService.del(`reset-password:${email}`);

    // Cache token in Redis
    await this.redisService.set(`reset-password-token:${email}`, token, ttl);

    return { token };
  }

  async resetPassword(token: string, newPassword: string) {
    let email: string;

    // Decode token to extract email
    try {
      const decoded = this.jwtService.verify(token);
      email = decoded.email;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token.');
    }

    // Verify token from Redis
    const cachedToken = await this.redisService.get(
      `reset-password-token:${email}`,
    );
    if (!cachedToken || cachedToken !== token)
      throw new UnauthorizedException('Invalid or expired token.');

    const user = await this.usersService.findByEmail({ email });
    if (!user) throw new BadRequestException('User does not exist.');

    user.password = await hashPassword(newPassword);
    await user.save();

    // Remove token from Redis after successful password reset
    await this.redisService.del(`reset-password-token:${email}`);

    return { message: 'Password reset successfully.' };
  }

  async handleRefreshToken(userId: string, refreshToken: string) {
    const hasToken = await this.tokenService.findOneByUserId(userId);
    if (!hasToken) throw new UnauthorizedException('Invalid refresh token');

    // Compare stored refreshToken with provided one
    if (hasToken.refreshToken !== refreshToken)
      throw new UnauthorizedException('Invalid refresh token');

    const hasUser: any = await this.usersService.findOneById(userId);

    const payload = { email: hasUser.email, sub: hasUser._id };

    const newAccessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '30m', // Expiration for accessToken
    });

    const newRefreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1d', // Expiration for refreshToken
    });

    // Store refreshToken in the database
    await this.tokenService.updateToken({
      userId: hasUser._id,
      refreshToken: newRefreshToken,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
