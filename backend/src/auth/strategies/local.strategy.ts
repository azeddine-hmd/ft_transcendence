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
    Logger.debug('LocalStrategy#validate: validating credentials...');
    const user = await this.authService.validateUser(username, password);

    if (!user) {
      Logger.error('LocalStrategy#validate: user not found!');
      throw new UnauthorizedException();
    }

    return { username: user.username, userId: user.id };
  }
}
