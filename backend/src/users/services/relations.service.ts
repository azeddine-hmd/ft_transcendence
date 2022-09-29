import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { Pair } from 'src/utils/pair';
import { Repository } from 'typeorm';
import { Profile } from '../../profiles/entities/profile.entity';
import { UserRelation } from '../entities/user-relation.entity';
import { User } from '../entities/user.entity';
import { normalizeTwoUsersRelation } from '../utils/user-relation-normalization';
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
  ) {}

  async getRelation(
    userId: string,
    otherUsername: string,
  ): Promise<UserRelation | null> {
    const current = await this.usersService.findOneFromUserId(userId);
    const other = await this.usersService.findOneFromUsername(otherUsername);
    if (!current || !other) throw new InternalServerErrorException();
    if (current === other)
      throw new BadRequestException(
        'cannot procced with relation between same user',
      );
    const { user1, user2 } = normalizeTwoUsersRelation(current, other);
    return await this.userRelationRepository.findOne({
      relations: {
        user1: true,
        user2: true,
      },
      where: {
        user1: { id: user1.id },
        user2: { id: user2.id },
      },
    });
  }

  async getAllFriendsRelations(
    userId: string,
  ): Promise<Pair<UserRelation, Profile>[]> {
    const current = await this.usersService.findOneFromUserId(userId);
    if (!current) throw new InternalServerErrorException();
    Logger.debug(
      `RelationService#getFriends: fetching friends ${current.username}(id=${current.id})`,
    );
    const relations = await this.userRelationRepository.find({
      relations: {
        user1: true,
        user2: true,
      },
      where: [
        { user1: { id: current.id }, friend1_2: true, friend2_1: true },
        { user2: { id: current.id }, friend1_2: true, friend2_1: true },
      ],
    });

    const pairs: Pair<UserRelation, Profile>[] = await Promise.all(
      relations.map(async (relation: UserRelation) => {
        let friendUserId: string | undefined;
        if (current.userId === relation.user1.userId) {
          friendUserId = relation.user2.userId;
        } else if (current.userId === relation.user2.userId) {
          friendUserId = relation.user1.userId;
        }
        if (typeof friendUserId === 'undefined')
          throw new InternalServerErrorException();

        const profile = await this.profileRepostiroy.findOne({
          relations: {
            user: true,
          },
          where: {
            user: { userId: friendUserId },
          },
        });
        if (!profile) throw new InternalServerErrorException();

        const pair: Pair<UserRelation, Profile> = {
          first: relation,
          second: profile,
        };

        return pair;
      }),
    );

    return pairs;
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
    return this.userRelationRepository.create({
      user1: user1,
      user2: user2,
    });
  }

  async addFriend(userId: string, otherUsername: string) {
    const current = await this.usersService.findOneFromUserId(userId);
    const other = await this.usersService.findOneFromUsername(otherUsername);
    if (!current || !other) throw new InternalServerErrorException();
    if (current.id === other.id)
      throw new BadRequestException(
        `you can't send friend request to yourself`,
      );

    const { user1, user2 } = normalizeTwoUsersRelation(current, other);
    const relation = await this.findOrCreate(user1, user2);
    console.log(relation);

    if (current.userId === user1.userId) {
      if (relation.friend1_2)
        throw new BadRequestException('friend request already exist');
      relation.friend1_2 = true;
    } else if (current.userId === user2.userId) {
      if (relation.friend2_1)
        throw new BadRequestException('friend request already exist');
      relation.friend2_1 = true;
    }

    await this.userRelationRepository.save(relation);
  }

  async blockUser(userId: string, otherUsername: string) {
    const current = await this.usersService.findOneFromUserId(userId);
    const other = await this.usersService.findOneFromUsername(otherUsername);
    if (!current || !other) throw new InternalServerErrorException();
    if (current.id === other.id)
      throw new BadRequestException(
        `you can't send friend request to yourself`,
      );
    const { user1, user2 } = normalizeTwoUsersRelation(current, other);
    const relation = await this.findOrCreate(user1, user2);

    if (relation.isBlocked) throw new BadRequestException('Already blocked');
    relation.isBlocked = true;

    await this.userRelationRepository.save(relation);
  }

  async unblockUser(userId: string, otherUsername: string) {
    const current = await this.usersService.findOneFromUserId(userId);
    const other = await this.usersService.findOneFromUsername(otherUsername);
    if (!current || !other) throw new InternalServerErrorException();
    if (current.id === other.id)
      throw new BadRequestException(
        `you can't send friend request to yourself`,
      );
    const { user1, user2 } = normalizeTwoUsersRelation(current, other);
    const relation = await this.findOrCreate(user1, user2);

    if (!relation.isBlocked) throw new BadRequestException('Already unblocked');
    relation.isBlocked = false;

    await this.userRelationRepository.save(relation);
  }
}
