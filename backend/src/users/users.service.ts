import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { FtProfileDto } from 'src/auth/dto/ft-profile.dto';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(createLoginDto: CreateUserDto) {
    const user: User = this.userRepository.create(createLoginDto);
    this.userRepository.save(user);
    Logger.debug(`user \`${user.username}\` is created and saved to database`);
    return user;
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(username: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ username: username });
    return user;
  }

  async findOrCreate(ftProfileDto: FtProfileDto): Promise<User> {
    const foundUser = await this.userRepository.findOneBy({
      ftId: +ftProfileDto.ftId,
    });
    if (!foundUser) {
      const user = plainToInstance(User, ftProfileDto);
      return this.userRepository.save(user);
    }
    return foundUser;
  }

  async remove(username: string): Promise<void> {
    Logger.log(`user \`${username}\` is removed from database`);
    await this.userRepository.delete({ username: username });
  }
}
