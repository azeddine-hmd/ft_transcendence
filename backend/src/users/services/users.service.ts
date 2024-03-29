import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { authenticator } from 'otplib';
import { EnvService } from 'src/conf/env.service';
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
    private readonly envService: EnvService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @Inject(forwardRef(() => UsersSocketService))
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

  async getTfa(userId: string): Promise<boolean> {
    const user = await this.findOneFromUserId(userId);
    if (!user) throw new NotFoundException();
    return user.tfa;
  }

  async getTfaSecret(username: string): Promise<string> {
    const user = await this.findOneFromUsername(username);
    if (!user) throw new NotFoundException();
    return user.tfaSecret;
  }

  async getOnline(userId: string): Promise<boolean> {
    const user = await this.findOneFromUserId(userId);
    if (!user) throw new NotFoundException('user not found');
    return user.online;
  }

  async getStatus(userId: string): Promise<string> {
    const user = await this.findOneFromUserId(userId);
    if (!user) throw new NotFoundException('user not found');
    return user.status;
  }

  /* creation operations */

  private async createUser(
    userLike: Partial<User>,
    profileLike: Partial<Profile>,
  ): Promise<User> {
    const unsavedUser = this.userRepository.create(userLike);
    const unsavedProfile = this.profileRepository.create(profileLike);
    unsavedProfile.user = unsavedUser;

    // check display name uniquness
    const profileFound = await this.profileRepository.findOne({
      where: {
        displayName: unsavedProfile.displayName,
      },
    });
    if (profileFound)
      throw new BadRequestException('display name already exist');

    // generate tfa secret
    const tfaSecret = authenticator.generateSecret();
    unsavedUser.tfaSecret = tfaSecret;

    const profile = await this.profileRepository.save(unsavedProfile);
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
    profileLike.avatar = this.envService.get('DEFAULT_AVATAR');
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
    return await this.userRepository.save(user);
  }

  async setTfa(username: string, value: boolean) {
    const user = await this.findOneFromUsername(username);
    if (!user) throw new NotFoundException('user not found!');
    user.tfa = value;
    await this.userRepository.save(user);
  }

  async setOnline(userId: string, value: boolean) {
    const user = await this.findOneFromUserId(userId);
    if (!user) throw new NotFoundException('user not found');
    user.online = value;
    await this.userRepository.save(user);
  }

  async setStatus(userId: string, status: string) {
    const user = await this.findOneFromUserId(userId);
    if (!user) throw new NotFoundException('user not found');
    user.status = status;
    await this.userRepository.save(user);
  }

  /* delete operation */

  async removeByUsername(username: string): Promise<void> {
    Logger.log(`user \`${username}\` is removed from database`);
    const user = await this.findOneFromUsername(username);
    if (user) {
      await this.userRepository.delete({ username: username });
    }
  }

  async removeById(id: string): Promise<void> {
    Logger.log(`user id \`${id}\` is removed from database`);
    const user = await this.findOneFromUserId(id);
    if (user) {
      await this.userRepository.delete({ userId: id });
    }
  }
}
