import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { FtProfileDto } from '../auth/dto/ft-profile.dto';
import { CreateUserDto } from '../auth/dto/payload/create-user.dto';
import { AddUserRelationDto } from './dto/payload/add-user-relation.dto';
import { UserRelation } from './entities/user-relation.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserRelation)
    private readonly userRelationRepository: Repository<UserRelation>,
  ) {}

  /* search operations */

  async findOne(unique: number | string): Promise<User | null> {
    if (typeof unique === 'number') {
      const user = await this.userRepository.findOneBy({ id: unique });
      return user;
    } else if (typeof unique === 'string') {
      return await this.userRepository.findOneBy({ username: unique });
    } else {
      return null;
    }
  }

  async getAllFriends(id: number): Promise<UserRelation[] | null> {
    return await this.userRelationRepository.find({
      relations: {
        user1: true,
        user2: true,
      },
      where: {
        user1: { id: id },
      },
    });
  }

  /* creation operations */

  async create(createLoginDto: CreateUserDto): Promise<User | null> {
    const foundUser = await this.userRepository.findOneBy({
      username: createLoginDto.username,
    });
    if (foundUser) {
      return null;
    }
    const user: User = this.userRepository.create(createLoginDto);
    this.userRepository.save(user);
    Logger.debug(`user \`${user.username}\` is created and saved to database`);
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

  async addUserRelation(
    id: number,
    addUserRelationDto: AddUserRelationDto,
  ): Promise<UserRelation | null> {
    // get frined user entity
    const friend = await this.findOne(addUserRelationDto.username);
    const current = await this.findOne(id);
    if (!friend || !current || current === friend) return null;

    Logger.debug(`friend(username=${friend.username},id=${friend.id}`);
    Logger.debug(`current(username=${current.username},id=${current.id})`);

    const getSubjects = (current: User, friend: User) => {
      if (current.id < friend.id) {
        return { user1: current, user2: friend };
      } else {
        return { user1: friend, user2: current };
      }
    };
    const subject = getSubjects(current, friend);
    console.log(subject);

    // check relation exist
    Logger.debug(
      `find user relation with (user1=${Math.min(
        id,
        friend.id,
      )},user2=${Math.max(id, friend.id)})`,
    );
    const foundRelation = await this.userRelationRepository.findOneBy({
      user1: { id: subject.user1.id },
      user2: { id: subject.user2.id },
    });
    console.log(foundRelation);
    if (foundRelation) {
      Logger.debug(`relation exist: id=${foundRelation.id}`);
      return null;
    }

    // creating and saving new relation
    const relation = this.userRelationRepository.create({
      user1: subject.user1,
      user2: subject.user2,
      isFriend: addUserRelationDto.relation_type === 'friend' ? true : false,
      isBlocked: addUserRelationDto.relation_type === 'block' ? true : false,
    });

    Logger.debug(`relation created id=${relation.toString()}`);

    return await this.userRelationRepository.save(relation);
  }

  /* update operations */

  async updateUser(id: number, updatePayload: any): Promise<User | null> {
    const user = await this.userRepository.preload({
      id,
      ...updatePayload,
    });
    if (!user) {
      return null;
    }
    Logger.debug(`updateUser#user: user ${user.username} updated successfully`);
    return this.userRepository.save(user);
  }

  /* delete operation */

  async removeByUsername(username: string): Promise<void> {
    Logger.log(`user \`${username}\` is removed from database`);
    await this.userRepository.delete({ username: username });
  }

  async removeById(id: number): Promise<void> {
    Logger.log(`user id \`${id}\` is removed from database`);
    await this.userRepository.delete({ id: id });
  }
}
