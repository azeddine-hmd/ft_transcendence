import { FriendsStatus } from '../dto/response/other-user-relation.dt';
import { UserRelation } from '../entities/user-relation.entity';

export function relationToFriendsStatus(
  relation: UserRelation,
  currentUserId: string,
): FriendsStatus {
  // pending
  if (currentUserId === relation.user1.userId) {
    if (relation.friend1_2 && !relation.friend2_1) return FriendsStatus.Pending;
  } else if (currentUserId === relation.user2.userId) {
    if (relation.friend2_1 && !relation.friend1_2) return FriendsStatus.Pending;
  }

  // accept
  if (currentUserId === relation.user1.userId) {
    if (relation.friend2_1 && !relation.friend1_2) return FriendsStatus.Accept;
  } else if (currentUserId === relation.user2.userId) {
    if (relation.friend1_2 && !relation.friend2_1) return FriendsStatus.Accept;
  }

  // friends
  if (relation.friend1_2 && relation.friend2_1) return FriendsStatus.Friends;

  // default neutral
  return FriendsStatus.Neutral;
}
