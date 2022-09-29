import { ProfileResponse } from '../dto/response/profile-response.dto';
import { Profile } from '../entities/profile.entity';

export function profileToProfileResponse(profile: Profile): ProfileResponse {
  return {
    id: profile.user.userId,
    username: profile.user.username,
    displayName: profile.displayName,
    avatar: profile.avatar,
  };
}
