import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async getProfile(username: string): Promise<Profile | null> {
    const profiles = await this.profileRepository.find({
      relations: {
        user: true,
      },
      where: {
        user: {
          username: username,
        },
      },
    });
    if (!profiles) return null;
    if (profiles.length > 1) {
      throw new InternalServerErrorException();
    }
    return profiles[0];
  }
}
