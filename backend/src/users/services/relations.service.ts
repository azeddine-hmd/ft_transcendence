import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { Repository } from 'typeorm';
import { Profile } from '../../profiles/entities/profile.entity';
import { UserRelation } from '../entities/user-relation.entity';
import { User } from '../entities/user.entity';
import { UsersService } from './users.service';

@Injectable()
export class RelationsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly usersService: UsersService,
    @InjectRepository(UserRelation)
    private readonly userRelationRepository: Repository<UserRelation>,
    @InjectRepository(Profile)
    private readonly profileRepostiroy: Repository<Profile>,
  ) { }

  normalizeTwoUsers(current: User, friend: User): { user1: User; user2: User } {
    if (current.id < friend.id) {
      return {
        user1: current,
        user2: friend,
      };
    } else {
      return {
        user1: friend,
        user2: current,
      };
    }
  }

  async getFriends(userId: string): Promise<UserRelation[]> {
    const current = await this.usersService.findOneFromUserId(userId);
    if (!current) throw new InternalServerErrorException();
    Logger.debug(
      `RelationService#getFriends: fetching friends ${current.username}(id=${current.id})`,
    );
    return await this.userRelationRepository.find({
      relations: {
        user1: true,
        user2: true,
        profile: true,
      },
      where: [{ user1: { id: current.id } }, { user2: { id: current.id } }],
    });
  }

  async findOrCreate(user1: User, user2: User): Promise<UserRelation> {
    const foundRelation = await this.userRelationRepository.findOneBy({
      user1: { id: user1.id },
      user2: { id: user2.id },
    });
    if (foundRelation) {
      Logger.debug(`found relation(id=${foundRelation.id})`);
      return foundRelation;
    }
    Logger.debug(`RelationService#findOrCreate: creating relation...`);
    Logger.debug(`user1: ${user1.id}`);
    Logger.debug(`user2: ${user2.id}`);
    const profile = await this.profileRepostiroy.findOne({
      relations: {
        user: true,
      },
      where: {
        user: { id: user2.id },
      },
    });
    if (!profile) throw new InternalServerErrorException();
    return this.userRelationRepository.create({
      user1: user1,
      user2: user2,
      profile: profile,
    });
  }

  async addFriend(userId: string, friendUsername: string) {
    const current = await this.usersService.findOneFromUserId(userId);
    const friend = await this.usersService.findOneFromUsername(friendUsername);
    if (!current || !friend) throw new InternalServerErrorException();

    if (current.id === friend.id)
      throw new BadRequestException(
        `you can't send friend request to yourself`,
      );

    const { user1, user2 } = this.normalizeTwoUsers(current, friend);
    const relation = await this.findOrCreate(user1, user2);
    console.log(relation);

    if (current.userId === user1.userId) {
      if (relation.PendingFriend1_2)
        throw new BadRequestException('friend request already exist');
      relation.PendingFriend1_2 = true;
    } else if (current.userId === user2.userId) {
      if (relation.PendingFriend2_1)
        throw new BadRequestException('friend request already exist');
      relation.PendingFriend2_1 = true;
    }
    if (relation.PendingFriend1_2 && relation.PendingFriend2_1) {
      relation.isFriend = true;
    }

    this.userRelationRepository.save(relation);
  }
}
