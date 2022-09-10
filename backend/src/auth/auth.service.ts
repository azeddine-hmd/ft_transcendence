import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginPayloadDto } from './dto/login-payload.dto';
import { UserPayloadDto } from './dto/user-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    if (user && user.password === pass) {
      Logger.log(`AuthService#validateUser: validation was success!`);
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async registerUser(createLoginDto: CreateUserDto): Promise<User> {
    const userFound = await this.usersService.findOne(createLoginDto.username);
    if (userFound) {
      Logger.error(`AuthService#registerUser: failed! user exist!`);
      throw new ForbiddenException();
    }
    const user = this.usersService.create(createLoginDto);
    Logger.log(
      `AuthService#registerUser: user '${user.username}' register is successful!`,
    );
    return user;
  }

  async login(user: UserPayloadDto): Promise<LoginPayloadDto> {
    Logger.log(`AuthService#login: user '${user.username}' logged-in!`);
    return {
      access_token: this.jwtService.sign(user),
    };
  }
}
