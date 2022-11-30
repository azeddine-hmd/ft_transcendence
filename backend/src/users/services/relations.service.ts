import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { Block } from 'src/chat/entities/block.entity';
import { Repository } from 'typeorm';
import { Profile } from '../../profiles/entities/profile.entity';
import { Pair } from '../../utils/pair';
import { UserRelation } from '../entities/user-relation.entity';
import { User } from '../entities/user.entity';
import { normalizeTwoUsersRelation } from '../utils/user-relation-normalization';

@Injectable()
export class RelationsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserRelation)
    private readonly userRelationRepository: Repository<UserRelation>,
    @InjectRepository(Profile)
    private readonly profileRepostiroy: Repository<Profile>,
    @InjectRepository(Block)
    private readonly blockRepository: Repository<Block>,
  ) {}

  async getRelation(
    userId: string,
    otherUsername: string,
  ): Promise<{ relation?: UserRelation | null; isBlocked: boolean }> {
    const current = await this.userRepository.findOneBy({ userId: userId });
    const other = await this.userRepository.findOneBy({
      username: otherUsername,
    });
    if (!current || !other) throw new InternalServerErrorException();
    if (current === other)
      throw new BadRequestException(
        'cannot procced with relation between same user',
      );
    const { user1, user2 } = normalizeTwoUsersRelation(current, other);
    let relation = await this.userRelationRepository.findOne({
      relations: {
        user1: true,
        user2: true,
      },
      where: {
        user1: { id: user1.id },
        user2: { id: user2.id },
      },
    });

    const isBlocked = await this.getBlockRelation(userId, otherUsername);

    // if (relation && relation.friend1_2 === true && relation.friend2_1 === false) {
    //   console.log(`deleting relation`);
      
    //   await this.userRelationRepository.delete({ id: relation.id });
    //   relation = null;
    // }


    return {
      relation: relation,
      isBlocked: isBlocked,
    };
  }

  async getBlockRelation(
    userId: string,
    otherUsername: string,
  ): Promise<boolean> {
    const current = await this.userRepository.findOneBy({ userId: userId });
    const other = await this.userRepository.findOneBy({
      username: otherUsername,
    });
    if (!current || !other) throw new InternalServerErrorException(`friend not found`);
    if (current === other)
      throw new BadRequestException(
        'cannot procced with relation between same user',
      );
    const blockRelation = await this.blockRepository.findOne({
      relations: {
        user1: true,
        user2: true,
      },
      where: {
        user1: { id: current.id },
        user2: { id: other.id },
      },
    });
    return !blockRelation ? false : true;
  }

  async getAllFriendsRelations(
    userId: string,
  ): Promise<Pair<{ relation: UserRelation; isBlocked: boolean }, Profile>[]> {
    const current = await this.userRepository.findOneBy({ userId: userId });
    if (!current) throw new InternalServerErrorException('user not found');
    /* Logger.debug( */
    /*   `RelationService#getFriends: fetching friends ${current.username}(id=${current.id})`, */
    /* ); */
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

    const pairs: Pair<
      { relation: UserRelation; isBlocked: boolean },
      Profile
    >[] = await Promise.all(
      relations.map(async (relation: UserRelation) => {
        let friendUserId: string | undefined;
        if (current.userId === relation.user1.userId) {
          friendUserId = relation.user2.userId;
        } else if (current.userId === relation.user2.userId) {
          friendUserId = relation.user1.userId;
        }
        
        if (typeof friendUserId === 'undefined')
          throw new InternalServerErrorException(`friend userid undefined`);


        const friendProfile = await this.profileRepostiroy.findOne({
          relations: {
            user: true,
          },
          where: {
            user: { userId: friendUserId },
          },
        });
        if (!friendProfile) throw new InternalServerErrorException();

        const isBlocked = await this.getBlockRelation(
          userId,
          friendProfile.user.username,
        );

        const pair: Pair<
          { relation: UserRelation; isBlocked: boolean },
          Profile
        > = {
          first: {
            relation: relation,
            isBlocked: isBlocked,
          },
          second: friendProfile,
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
    const current = await this.userRepository.findOneBy({ userId: userId });
    const other = await this.userRepository.findOneBy({
      username: otherUsername,
    });
    if (!current || !other) throw new InternalServerErrorException();
    if (current.id === other.id)
      throw new BadRequestException(
        `you can't send friend request to yourself`,
      );

    const blockRelation_1 = await this.getBlockRelation(userId, otherUsername);
    const blockRelation_2 = await this.getBlockRelation(
      other.userId,
      current.username,
    );
    if (blockRelation_1 || blockRelation_2)
      throw new BadRequestException(
        `you can't add him as friend if block relation exist`,
      );

    const { user1, user2 } = normalizeTwoUsersRelation(current, other);

    const relation = await this.findOrCreate(user1, user2);

    if (current.userId === user1.userId) {
      if (relation.friend1_2)
        throw new BadRequestException('friend request already exist');
      relation.friend1_2 = true;
    } else if (current.userId === user2.userId) {
      if (relation.friend2_1)
        throw new BadRequestException('friend request already exist');
      relation.friend2_1 = true;
    }

    console.log(relation);
    

    await this.userRelationRepository.save(relation);
  }

  async removeFriend(userId: string, otherUsername: string) {
    const current = await this.userRepository.findOneBy({ userId: userId });
    const other = await this.userRepository.findOneBy({
      username: otherUsername,
    });
    if (!current || !other) throw new InternalServerErrorException();
    if (current.id === other.id)
      throw new BadRequestException(
        `you can't send friend remove request to yourself`,
      );

    const { user1, user2 } = normalizeTwoUsersRelation(current, other);
    const relation = await this.userRelationRepository.findOne({
      relations: {
        user1: true,
        user2: true,
      },
      where: {
        user1: { userId: user1.userId },
        user2: { userId: user2.userId },
      },
    });
    if (!relation || !relation.friend1_2 || !relation.friend2_1)
      throw new BadRequestException(
        `Not a friend to remove it from friend list`,
      );
    await this.userRelationRepository.delete({ id: relation.id });
  }

  async blockUser(userId: string, otherUsername: string) {
    const current = await this.userRepository.findOneBy({ userId: userId });
    const other = await this.userRepository.findOneBy({
      username: otherUsername,
    });
    if (!current || !other) throw new InternalServerErrorException();
    const blockRelation = await this.blockRepository.findOneBy({
      user1: { id: current.id },
      user2: { id: other.id },
    });

    // create block relation
    if (blockRelation) {
      throw new BadRequestException('user already blocked');
    }
    const newBlockRelation = this.blockRepository.create({
      user1: current,
      user2: other,
    });
    await this.blockRepository.save(newBlockRelation);

    // remove friend relationship
    const { user1, user2 } = normalizeTwoUsersRelation(current, other);
    const relation = await this.findOrCreate(user1, user2);
    relation.friend1_2 = false;
    relation.friend2_1 = false;
  }

  async unblockUser(userId: string, otherUsername: string) {
    const current = await this.userRepository.findOneBy({ userId: userId });
    const other = await this.userRepository.findOneBy({
      username: otherUsername,
    });
    if (!current || !other) throw new InternalServerErrorException();
    const blockRelation = await this.blockRepository.findOneBy({
      user1: { id: current.id },
      user2: { id: other.id },
    });

    // unblock from rleation
    if (!blockRelation) {
      throw new NotFoundException('user already unblocked');
    }
    this.blockRepository.delete({ id: blockRelation.id });
  }
}
