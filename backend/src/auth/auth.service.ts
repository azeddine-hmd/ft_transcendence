import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/services/users.service';
import { SignupUserDto } from './dto/payload/signup-user.dto';
import { LoginResponseDto } from './dto/response/login-response.dto';
import { UserJwtPayload } from './types/user-jwt-payload';

@Injectable()
export class AuthService {
  refreshTokens = new Map<string, string | null>();

  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
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
    // creating user
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

  async login(jwtPayload: UserJwtPayload): Promise<LoginResponseDto> {
    Logger.log(`AuthService#login: user '${jwtPayload.username}' logged-in!`);
    const access_token = this.jwtService.sign(jwtPayload);
    return {
      access_token: access_token,
    };
  }

  verifyToken(token: string) {
    try {
      return {
        payload: this.jwtService.verify(token),
        expired: false,
      };
    } catch (error) {
      if ((error as Error).name === 'TokenExpiredError') {
        return {
          payload: this.jwtService.decode(token),
          expired: true,
        };
      }
      throw error;
    }
  }

  refreshToken(expiredToken: string, refreshToken: string) {
    //TDOO: implement
  }
}
