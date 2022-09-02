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
    const user = await this.usersService.findOne(username);

    if (user && user.password === pass) {
      Logger.log(`validation was success!`);
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async registerUser(createLoginDto: CreateLoginDto): Promise<User> {
    const userFound = await this.usersService.findOne(createLoginDto.username);
    if (userFound) {
      Logger.error(`registerUser: failed user exist!`);
      throw new ForbiddenException();
    }
    const user = this.usersService.create(createLoginDto);
    Logger.log(`user '${user.username}' register successfully!`);
    return user;
  }

  async login(user: any) {
    Logger.log(`user '${user.username}' logged-in!`);
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
