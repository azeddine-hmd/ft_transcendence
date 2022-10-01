import { ProfileResponse } from "./profile-response.dto";

export enum FriendsStatus {
  Neutral = 'neutral',
  Pending = 'pending',
  Accept = 'accept',
  Friends = 'friends',
}

export interface FriendsResponse {
    profile: ProfileResponse,
    friends_status: FriendsStatus,
    is_blocked: boolean;
}
