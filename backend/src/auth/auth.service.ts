import {
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/services/users.service';
import { SignupUserDto } from './dto/payload/signup-user.dto';
import { LoginResponseDto } from './dto/response/login-response.dto';
import { JwtPayload } from './types/jwt-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneFromUsername(username);

    if (!user || !user.password) return null;
    if (user && (await bcrypt.compare(pass, user.password))) {
      Logger.log(`AuthService#validateUser: validation was success!`);
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async registerUser(signupUserDto: SignupUserDto): Promise<User> {
    // hashing password
    signupUserDto.password = await bcrypt.hash(
      signupUserDto.password,
      await bcrypt.genSalt(),
    );

    const user = await this.usersService.create(signupUserDto);

    if (!user) {
      Logger.error(`AuthService#registerUser: failed! user exist!`);
      throw new ForbiddenException('user exist');
    }

    Logger.log(
      `AuthService#registerUser: user '${user.username}' register is successful!`,
    );

    return user;
  }

  async login(jwtPayload: JwtPayload): Promise<LoginResponseDto> {
    Logger.log(`AuthService#login: user '${jwtPayload.username}' logged-in!`);
    const access_token = this.jwtService.sign(jwtPayload);
    await this.usersService.updateUser(jwtPayload.userId, {
      token: access_token,
    });
    return {
      access_token: access_token,
    };
  }

  async verifyToken(token: string, payload: any) {
    // get stored token and verify expiration time
    const user = await this.usersService.findOneFromUserId(payload.userId);
    if (!user || !user.token) throw new UnauthorizedException();

    // compare incoming token with stored token
    // throw error if not equal
    if (user.token && user.token !== token) {
      Logger.error('valid token but have been revoked with a new one!');
      throw new UnauthorizedException(
        'valid token but have been revoked with a new one!',
      );
    }
  }

  extractPayload(token: string) {
    return this.jwtService.decode(token) as any;
  }
}
