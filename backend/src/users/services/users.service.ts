import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignupUserDto } from '../../auth/dto/payload/signup-user.dto';
import { FtProfile } from '../../auth/types/ft-profile';
import { ftProfileDtoToUserProfile } from '../../auth/utils/entity-payload-converter';
import { Profile } from '../../profiles/entities/profile.entity';
import { UserUpdateOptions } from '../dto/types/user-update-options';
import { User } from '../entities/user.entity';
import { signupUserDtoToUserProfile } from '../utils/entity-payload-converter';
import { UsersSocketService } from './users-socket.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly usersSocketService: UsersSocketService,
  ) {}

  /* search operations */

  async findOneFromUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ username: username });
  }

  async findOneFromUserId(userId: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ userId: userId });
  }

  async getUserPK(userId: string): Promise<number> {
    const user = await this.findOneFromUserId(userId);
    if (!user) throw new NotFoundException();
    return user.id;
  }

  /* creation operations */

  private async createUser(
    userLike: Partial<User>,
    profileLike: Partial<Profile>,
  ): Promise<User> {
    const unsavedUser = this.userRepository.create(userLike);
    const unsavedProfile = this.profileRepository.create(profileLike);
    unsavedProfile.user = unsavedUser;
    const profile = await this.profileRepository.save(unsavedProfile);
    this.usersSocketService.addUser(unsavedUser.userId);
    return profile.user;
  }

  async create(signupUserDto: SignupUserDto): Promise<User | null> {
    const foundUser = await this.userRepository.findOneBy({
      username: signupUserDto.username,
    });
    if (foundUser) {
      return null;
    }
    const { userLike, profileLike } = signupUserDtoToUserProfile(signupUserDto);
    profileLike.avatar = this.configService.get<string>('DEFAULT_AVATAR');
    const user = await this.createUser(userLike, profileLike);
    Logger.debug(`user \`${user.username}\` is created and saved to database`);
    return user;
  }

  async findOrCreate(profile: FtProfile): Promise<User> {
    const foundUser = await this.userRepository.findOneBy({
      ftId: +profile.ftId,
    });
    if (!foundUser) {
      const { userLike, profileLike } = ftProfileDtoToUserProfile(profile);
      return await this.createUser(userLike, profileLike);
    }
    return foundUser;
  }

  /* update operations */

  async updateUser(
    userId: string,
    userUpdateOptions: UserUpdateOptions,
  ): Promise<User | null> {
    const pk = await this.getUserPK(userId);
    const user = await this.userRepository.preload({
      id: pk,
      ...userUpdateOptions,
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
    const user = await this.findOneFromUsername(username);
    if (user) {
      this.usersSocketService.removeUser(user.userId);
      await this.userRepository.delete({ username: username });
    }
  }

  async removeById(id: string): Promise<void> {
    Logger.log(`user id \`${id}\` is removed from database`);
    const user = await this.findOneFromUserId(id);
    if (user) {
      this.usersSocketService.removeUser(user.userId);
      await this.userRepository.delete({ userId: id });
    }
  }
}
