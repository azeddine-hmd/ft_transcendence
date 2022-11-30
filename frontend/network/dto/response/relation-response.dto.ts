import { FriendsStatus } from "./friends-response.dto";

export interface RelationResponse {
    friends: FriendsStatus,
    blocked: boolean,
}
