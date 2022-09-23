import { SignupUserDto } from '../../auth/dto/payload/signup-user.dto';
import { Profile } from '../../profiles/entities/profile.entity';
import { User } from '../entities/user.entity';

export function signupUserDtoToUserProfile(signupUserDto: SignupUserDto): {
  userLike: Partial<User>;
  profileLike: Partial<Profile>;
} {
  return {
    userLike: {
      username: signupUserDto.username,
      password: signupUserDto.password,
    },
    profileLike: {
      displayName: signupUserDto.displayName,
    },
  };
}
