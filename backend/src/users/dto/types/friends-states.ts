import { ProfileResponse } from 'src/profiles/dto/response/profile-response.dto';

export class FriendsStates {
  profile: ProfileResponse;
  states: {
    online: boolean;
    status: string;
  };
}
