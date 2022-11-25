import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { authenticator } from 'otplib';
import { EnvService } from 'src/conf/env.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/services/users.service';
import { SignupUserDto } from './dto/payload/signup-user.dto';
import { Tokens } from './types/login';
import { UserJwtPayload } from './types/user-jwt-payload';

@Injectable()
export class AuthService {
  private refreshTokens = new Map<string, string | null>();
  private tfaSecrets = new Map<string, string>();

  constructor(
    private readonly envService: EnvService,
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

  async register(signupUserDto: SignupUserDto): Promise<User> {
    // hashing password
    signupUserDto.password = await bcrypt.hash(
      signupUserDto.password,
      await bcrypt.genSalt(),
    );

    // creating user
    const user = await this.usersService.create(signupUserDto);
    if (!user) {
      Logger.error(`AuthService#registerUser: failed! user exist!`);
      throw new ForbiddenException('User already exist');
    }

    // otp
    /* const secret = this.envService.get('OTP_SECRET'); */
    const secret = authenticator.generateSecret();
    this.tfaSecrets.set(user.username, secret);
    const result = await authenticator.keyuri(
      user.username,
      'PING_PONG_GAME',
      secret,
    );
    console.log(`qrcode uri: ${result}`);

    Logger.log(
      `AuthService#registerUser: user '${user.username}' register is successful!`,
    );
    return user;
  }

  async login(
    userJwtPayload: Express.User,
  ): Promise<{ tokens: Tokens; tfa?: string }> {
    Logger.log(
      `AuthService#login: user '${userJwtPayload.username}' logged-in!`,
    );
    const isTfaEnabled = await this.usersService.getTfa(userJwtPayload.userId);
    if (isTfaEnabled) {
      if (userJwtPayload.tfa === undefined) userJwtPayload.tfa = 'pending';
    } else {
      userJwtPayload.tfa = undefined;
    }
    const accessToken = this.jwtService.sign(userJwtPayload);
    const refreshToken = this.getRefreshToken(userJwtPayload);
    return {
      tokens: {
        accessToken,
        refreshToken,
      },
      tfa: userJwtPayload.tfa,
    };
  }

  verifyJwtToken(token: string) {
    try {
      return {
        jwtPayload: this.jwtService.verify(token) as UserJwtPayload,
        expired: false,
      };
    } catch (error) {
      if ((error as Error).name === 'TokenExpiredError') {
        return {
          jwtPayload: this.jwtService.decode(token) as UserJwtPayload,
          expired: true,
        };
      }
      throw new UnauthorizedException();
    }
  }

  private generateRefreshToken(userJwtPayload: UserJwtPayload): string {
    const expirationTime = this.envService.get(
      'JWT_REFRESH_EXPIRATION_DURATION',
    );
    const newToken = this.jwtService.sign(userJwtPayload, {
      expiresIn: expirationTime,
    });
    this.refreshTokens.set(userJwtPayload.username, newToken);
    return newToken;
  }

  getRefreshToken(userJwtPayload: UserJwtPayload): string {
    const token = this.refreshTokens.get(userJwtPayload.username);
    if (!token) return this.generateRefreshToken(userJwtPayload);
    try {
      const { expired } = this.verifyJwtToken(token);
      if (!expired) return token;
      return this.generateRefreshToken(userJwtPayload);
    } catch (err) {
      return this.generateRefreshToken(userJwtPayload);
    }
  }

  async refreshAcessToken(opts: {
    expiredToken: string;
    refreshToken: string;
  }): Promise<string> {
    const { expiredToken, refreshToken } = opts;
    try {
      const { jwtPayload, expired } = this.verifyJwtToken(expiredToken);
      if (expired) {
        if (refreshToken === this.refreshTokens.get(jwtPayload.username)) {
          return (await this.login(jwtPayload)).tokens.accessToken;
        }
      }
      throw new BadRequestException('access token is still valid');
    } catch (err) {
      throw new BadRequestException('unknown error');
    }
  }

  async tfa(username: string, value: boolean) {
    this.usersService.setTfa(username, value);
  }
}
