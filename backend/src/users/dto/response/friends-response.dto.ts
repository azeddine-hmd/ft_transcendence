import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { ProfileResponseDto } from '../../../profiles/dto/response/profile-response.dto';

export class FriendsResponseDto {
  @ApiProperty()
  profile: ProfileResponseDto;
  @ApiProperty()
  is_blocked: boolean;
}
