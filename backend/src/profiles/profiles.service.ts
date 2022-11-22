import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { EnvService } from 'src/conf/env.service';
import { ILike, Not, Repository } from 'typeorm';
import { UploadService } from '../users/services/upload.service';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfilesService {
  constructor(
    private readonly envService: EnvService,
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
    const profile = await this.profilesRepository.findOne({
      relations: {
        user: true,
      },
      where: {
        user: { userId: userId },
      },
    });
    if (!profile) throw new InternalServerErrorException();
    profile.avatar =
      this.envService.get('BACKEND_HOST') + '/api/images/' + filename;
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
    await this.profilesRepository.save(profile);
  }

  async autocompleteDisplayname(
    userId: string,
    displaynameLike: string,
  ): Promise<Profile[]> {
    return await this.profilesRepository.find({
      relations: {
        user: true,
      },
      where: {
        displayName: ILike(`${displaynameLike}%`),
        user: { userId: Not(userId) },
      },
    });
  }
}
