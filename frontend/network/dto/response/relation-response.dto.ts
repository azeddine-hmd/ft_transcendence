import { FriendsStatus } from "./friends-response.dto";

export interface RelationResponse {
    friends_status: FriendsStatus,
    is_blocked: boolean,
}
