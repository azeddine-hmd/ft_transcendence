import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { Repository } from 'typeorm';
import { AddUserRelationDto } from '../dto/payload/add-user-relation.dto';
import { UserRelation } from '../entities/user-relation.entity';
import { User } from '../entities/user.entity';
import { UsersService } from './users.service';

@Injectable()
export class RelationsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserRelation)
    private readonly userRelationRepository: Repository<UserRelation>,
    private readonly usersService: UsersService,
  ) {}

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

  async addUserRelation(
    userId: string,
    addUserRelationDto: AddUserRelationDto,
  ): Promise<UserRelation | null> {
    // get frined user entity
    const friend = await this.usersService.findOneFromUsername(
      addUserRelationDto.username,
    );
    const current = await this.usersService.findOneFromUserId(userId);
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
        current.id,
        friend.id,
      )},user2=${Math.max(current.id, friend.id)})`,
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
}
