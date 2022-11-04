import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/services/users.service';
import { SignupUserDto } from './dto/payload/signup-user.dto';
import { Login } from './types/login';
import { UserJwtPayload } from './types/user-jwt-payload';

@Injectable()
export class AuthService {
  refreshTokens = new Map<string, string | null>();

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async validateUser(username: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findOneFromUsername(username);
    if (!user || !user.password) return null;
    if (user && (await bcrypt.compare(pass, user.password))) {
      Logger.log(`AuthService#validateUser: validation was success!`);
      return user;
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

  generateRefreshToken(userJwtPayload: UserJwtPayload): string {
    const refreshExpirationTime = this.configService.get<string>(
      'JWT_REFRESH_EXPIRATION_DURATION',
    );
    if (!refreshExpirationTime)
      throw new InternalServerErrorException(
        'JWT_REFRESH_EXPIRATION_DURATION env variable not defined',
      );

    const newToken = this.jwtService.sign(
      {
        ...userJwtPayload,
        isRefreshToken: true,
      },
      { expiresIn: refreshExpirationTime },
    );
    this.refreshTokens.set(userJwtPayload.username, newToken);
    return newToken;
  }

  getRefreshToken(userJwtPayload: UserJwtPayload): string {
    const token = this.refreshTokens.get(userJwtPayload.username);
    if (!token) return this.generateRefreshToken(userJwtPayload);
    const { expired } = this.verifyJwtToken(token);
    if (expired) return this.generateRefreshToken(userJwtPayload);
    return token;
  }

  login(userJwtPayload: UserJwtPayload): Login {
    Logger.log(
      `AuthService#login: user '${userJwtPayload.username}' logged-in!`,
    );
    const accessToken = this.jwtService.sign(userJwtPayload);
    const refreshToken = this.getRefreshToken(userJwtPayload);
    Logger.log(
      `refresh token for \`${userJwtPayload.username}: ${refreshToken}`,
    );
    return { accessToken, refreshToken };
  }

  verifyJwtToken(token: string) {
    try {
      return {
        jwtPayload: this.jwtService.verify(token),
        expired: false,
      };
    } catch (error) {
      if ((error as Error).name === 'TokenExpiredError') {
        return {
          jwtPayload: this.jwtService.decode(token),
          expired: true,
        };
      }
      throw new UnauthorizedException();
    }
  }

  verifyRefreshingAccessToken(expiredToken: string, refreshToken: string) {
    //TDOO: implement
  }
}
