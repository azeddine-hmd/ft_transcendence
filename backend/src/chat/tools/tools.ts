import BlockedUsers from "./Blockedusers";

export let inBlockedList = (blockedUsers: any, id: number) =>
{
  for (let i = 0; i < blockedUsers.length; i++) {
    const element = blockedUsers[i];
    if (id  == element.user2.userId)
      return (1);
  }
  return (0);
}