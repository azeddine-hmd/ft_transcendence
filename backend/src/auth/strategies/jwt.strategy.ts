import { UnauthorizedException } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvService } from 'src/conf/env.service';
import { UsersService } from 'src/users/services/users.service';
import { UserJwtPayload } from '../types/user-jwt-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    envService: EnvService,
    private readonly usersService: UsersService,
  ) {
    super({
      ignoreExpiration: false,
      secretOrKey: envService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req.cookies.access_token;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
    });
  }

  async validate(payload: UserJwtPayload): Promise<Express.User> {
    const tfaEnbaled = await this.usersService.getTfa(payload.userId);
    if (tfaEnbaled) {
      if (payload.tfa !== 'accepted')
        throw new UnauthorizedException('tfa not verified yet');
    }
    return {
      username: payload.username,
      userId: payload.userId,
      tfa: payload.tfa,
    };
  }
}
