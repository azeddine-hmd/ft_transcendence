import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreateLoginDto } from './dto/create-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    Logger.debug(`validating user credentials...`);
    const user = await this.usersService.findOne(username);

    if (user && user.password === pass) {
      const { password, ...result } = user;
      Logger.debug(`user exist, result: \`${result}\``);
      return result;
    }

    return null;
  }

  async registerUser(createLoginDto: CreateLoginDto): Promise<User> {
    const user = await this.usersService.findOne(createLoginDto.username);
    if (user) {
      throw new ForbiddenException();
    }
    const newUser = this.usersService.create(createLoginDto);

    return newUser;
  }

  async login(user: any) {
    Logger.log(`generating jwt token for user(${user})...`);
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
