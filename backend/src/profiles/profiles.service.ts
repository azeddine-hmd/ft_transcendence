import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { UploadService } from '../users/services/upload.service';
import { Like, Not, Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfilesService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Profile)
    private readonly profilesRepository: Repository<Profile>,
    private readonly uploadService: UploadService,
  ) {}

  async getProfile(username: string): Promise<Profile | null> {
    const profile = await this.profilesRepository.findOne({
      relations: {
        user: true,
      },
      where: {
        user: {
          username: username,
        },
      },
    });
    if (!profile) return null;
    return profile;
  }

  async changeAvatarFromUpload(userId: string, avatar: Express.Multer.File) {
    const filename = await this.uploadService.saveFile(avatar);

    const backendHost = this.configService.get<string>('BACKEND_HOST');
    if (typeof backendHost === 'undefined')
      throw new InternalServerErrorException();

    const profile = await this.profilesRepository.findOne({
      relations: {
        user: true,
      },
      where: {
        user: { userId: userId },
      },
    });
    if (!profile) throw new InternalServerErrorException();

    profile.avatar = backendHost + '/api/images/' + filename;
    await this.profilesRepository.save(profile);
  }

  async updateDisplayName(userId: string, displayName: string) {
    const profile = await this.profilesRepository.findOne({
      relations: {
        user: true,
      },
      where: {
        user: { userId: userId },
      },
    });
    if (!profile) throw new InternalServerErrorException();
    profile.displayName = displayName;
    this.profilesRepository.save(profile);
  }

  async autocompleteUsername(
    userId: string,
    usernameLike: string,
  ): Promise<Profile[]> {
    return await this.profilesRepository.find({
      relations: {
        user: true,
      },
      where: {
        user: { username: Like(`${usernameLike}%`), userId: Not(userId) },
      },
    });
  }
}
