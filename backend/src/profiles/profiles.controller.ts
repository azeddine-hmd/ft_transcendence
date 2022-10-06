import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { JwtAuth } from '../auth/guards/jwt-auth.guard';
import { Profile } from '../profiles/entities/profile.entity';
import { AvatarDto } from './dto/payload/avatar.dto';
import { DisplayNameDto } from './dto/payload/display-name.dto';
import { ProfileResponse } from './dto/response/profile-response.dto';
import { ProfilesService } from './profiles.service';
import { profileToProfileResponse } from './utils/entity-payload-converter';

@ApiBearerAuth()
@ApiTags('profile')
@JwtAuth
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
  @Get('/username/:username')
  async getOthersProfile(
    @Param('username') username: string,
  ): Promise<ProfileResponse> {
    const profile = await this.profilesService.getProfile(username);
    if (!profile) throw new NotFoundException();
    return profileToProfileResponse(profile);
  }

  @ApiOperation({ summary: `Upload image and use it as profile's avatar` })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: AvatarDto })
  @UseInterceptors(FileInterceptor('avatar'))
  @HttpCode(HttpStatus.OK)
  @Post('/avatar')
  async uploadAvatar(
    @Req() req: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 8_000_000 /* 8MB */ }),
          new FileTypeValidator({ fileType: RegExp('(jpeg|jpg|png|gif)$') }),
        ],
      }),
    )
    avatar: Express.Multer.File,
  ) {
    this.profilesService.changeAvatarFromUpload(req.user.userId, avatar);
  }

  @ApiBody({ type: DisplayNameDto })
  @ApiOperation({ summary: 'Update display name of current user' })
  @Post('/display-name')
  async updateDisplayName(
    @Req() req: any,
    @Body() displayNameDto: DisplayNameDto,
  ) {
    await this.profilesService.updateDisplayName(
      req.user.userId,
      displayNameDto.displayName,
    );
  }

  @ApiResponse({ type: [ProfileResponse] })
  @ApiQuery({ name: 'username', type: 'string' })
  @ApiOperation({ summary: 'Autocomplete profiles' })
  @Get('/autocomplete')
  async autocompleteProfile(
    @Req() req: any,
    @Query('username') usernameLike: string,
  ): Promise<ProfileResponse[]> {
    const profiles: Profile[] = await this.profilesService.autocompleteUsername(
      req.user.userId,
      usernameLike,
    );

    return profiles.map((value) => {
      return profileToProfileResponse(value);
    });
  }
}
