import { User } from '../entities/user.entity';

export function normalizeTwoUsersRelation(
  current: User,
  friend: User,
): { user1: User; user2: User } {
  if (current.id < friend.id) {
    return {
      user1: current,
      user2: friend,
    };
  } else {
    return {
      user1: friend,
      user2: current,
    };
  }
}
