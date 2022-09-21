import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/payload/create-user.dto';
import { LoginResponseDto } from './dto/response/login-response.dto';
import { UserPayloadDto } from './dto/user-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    if (!user || !user.password) return null;
    if (user && (await bcrypt.compare(pass, user.password))) {
      Logger.log(`AuthService#validateUser: validation was success!`);
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async registerUser(createUserDto: CreateUserDto): Promise<User> {
    // hashing password
    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      await bcrypt.genSalt(),
    );

    const user = await this.usersService.create(createUserDto);

    if (!user) {
      Logger.error(`AuthService#registerUser: failed! user exist!`);
      throw new ForbiddenException();
    }

    Logger.log(
      `AuthService#registerUser: user '${user.username}' register is successful!`,
    );

    return user;
  }

  async login(user: UserPayloadDto): Promise<LoginResponseDto> {
    Logger.log(`AuthService#login: user '${user.username}' logged-in!`);
    const access_token = this.jwtService.sign(user);
    await this.usersService.updateUser(user.userId, { token: access_token });
    return {
      access_token: access_token,
    };
  }
}
