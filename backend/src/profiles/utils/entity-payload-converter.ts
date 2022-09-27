import { User } from '../../users/entities/user.entity';
import { ProfileResponseDto } from '../dto/response/profile-response.dto';
import { Profile } from '../entities/profile.entity';

export function profileToProfileResponse(profile: Profile): ProfileResponseDto {
  return {
    id: profile.user.userId,
    username: profile.user.username,
    displayName: profile.displayName,
    avatar: profile.avatar,
  };
}

export function profileToProfileResponse2(
  profile: Profile,
  user: User,
): ProfileResponseDto {
  return {
    id: user.userId,
    username: user.username,
    displayName: profile.displayName,
    avatar: profile.avatar,
  };
}
