import { Profile } from '../../profiles/entities/profile.entity';
import { User } from '../../users/entities/user.entity';
import { FtProfileDto } from '../dto/payload/ft-profile.dto';

export function ftProfileDtoToUserProfile(ftProfileDto: FtProfileDto): {
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
    },
  };
}
