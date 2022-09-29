import { Controller, Get, NotFoundException, Param, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProfileResponse } from './dto/response/profile-response.dto';
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
  @ApiOperation({ summary: 'Get profile of current user' })
  @Get()
  async getMyProfile(@Req() req: any): Promise<ProfileResponse> {
    const profile = await this.profilesService.getProfile(req.user.username);
    if (!profile) throw new NotFoundException();
    return profileToProfileResponse(profile);
  }

  @ApiResponse({
    status: 200,
    type: ProfileResponse,
  })
  @ApiOperation({ summary: 'Get others profile from username' })
  @Get(':username')
  async getOthersProfile(
    @Param('username') username: string,
  ): Promise<ProfileResponse> {
    const profile = await this.profilesService.getProfile(username);
    if (!profile) throw new NotFoundException();
    return profileToProfileResponse(profile);
  }
}
