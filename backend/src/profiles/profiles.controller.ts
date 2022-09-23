import { Controller, Get, NotFoundException, Param, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProfileResponseDto } from './dto/response/profile-response.dto';
import { ProfilesService } from './profiles.service';
import { profileToProfileResponse } from './utils/entity-payload-converter';

@ApiBearerAuth()
@ApiTags('profile')
@JwtAuthGuard
@Controller('/api/profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @ApiResponse({
    description: `get current user's profile`,
  })
  @Get()
  async getMyProfile(@Req() req: any) {
    const profile = await this.profilesService.getProfile(req.user.username);
    if (!profile) throw new NotFoundException();
    return profile;
  }

  @ApiResponse({
    type: ProfileResponseDto,
    description: `get someone's profile using his/her username`,
  })
  @Get(':username')
  async getOthersProfile(
    @Param('username') username: string,
  ): Promise<ProfileResponseDto> {
    const profile = await this.profilesService.getProfile(username);
    if (!profile) throw new NotFoundException();
    return profileToProfileResponse(profile);
  }
}