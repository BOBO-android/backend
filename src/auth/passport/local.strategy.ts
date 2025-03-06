import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { UserType } from '../auth';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<UserType | null> {
    const user = await this.authService.validateUser(email, password);

    if (!user)
      throw new UnauthorizedException('email or password not correct!');

    if (!user.isActive)
      throw new BadRequestException('Account has not been activated!');

    return user;
  }
}
