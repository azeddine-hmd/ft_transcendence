import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLoginDto } from '../auth/dto/create-login.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(createLoginDto: CreateLoginDto) {
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

  async remove(username: string): Promise<void> {
    Logger.log(`user \`${username}\` is removed from database`);
    await this.userRepository.delete({ username: username });
  }
}
