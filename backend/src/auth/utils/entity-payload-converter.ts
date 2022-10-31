import { Profile } from '../../profiles/entities/profile.entity';
import { User } from '../../users/entities/user.entity';
import { FtProfile } from '../types/ft-profile';

export function ftProfileDtoToUserProfile(ftProfileDto: FtProfile): {
  userLike: Partial<User>;
  profileLike: Partial<Profile>;
} {
  return {
    userLike: {
      ftId: +ftProfileDto.ftId,
      username: ftProfileDto.username,
    },
    profileLike: {
      displayName: ftProfileDto.displayName,
      avatar: ftProfileDto.avatar,
    },
  };
}
