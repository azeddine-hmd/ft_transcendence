import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    Logger.debug('LocalStrategy: validating credentials');
    const user = await this.authService.validateUser(username, password);

    if (!user) {
      Logger.error('LocalStrategy: user not found');
      throw new UnauthorizedException();
    }

    return user;
  }
}
