import { Logger, UnauthorizedException } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: any) {
    Logger.debug(`JwtStrategy#validate: starting...`);
    // get incoming token
    const auth = request.headers.authorization;
    if (!auth || auth.split(' ').length !== 2)
      throw new UnauthorizedException();
    const incomingToken = auth.split(' ')[1];

    // get stored token and verify expiration time
    const user = await this.usersService.findOneFromUserId(payload.userId);
    if (!user || !user.token) throw new UnauthorizedException();
    //verify token or not ?

    // compare incoming token with stored token
    // throw error if not equal
    if (user.token && user.token !== incomingToken) {
      Logger.error('valid token but have been revoked with a new one!');
      throw new UnauthorizedException(
        'valid token but have been revoked with a new one!',
      );
    }

    return { username: payload.username, userId: payload.userId };
  }
}
