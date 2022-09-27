import { ProfileResponse } from "./profile-response.dto";

export interface FriendsResponse {
    profile: ProfileResponse
    is_blocked: boolean;
}
