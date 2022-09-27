import { Injectable } from '@nestjs/common';
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
    const profile = await this.profileRepository.findOne({
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
}
