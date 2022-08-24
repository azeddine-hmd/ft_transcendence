import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(username: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ username: username });

    if (!user) throw new NotFoundException();

    return user;
  }

  async remove(username: string): Promise<void> {
    await this.userRepository.delete({ username: username });
  }
}
