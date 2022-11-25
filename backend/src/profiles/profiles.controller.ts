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
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
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
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @ApiResponse({
    description: `get current user's profile`,
  })
  @ApiOperation({ summary: 'Get profile of current user' })
  @Get()
  async getMyProfile(@Req() req: Request): Promise<ProfileResponse> {
    if (req.user === undefined) throw new UnauthorizedException();
    const profile = await this.profilesService.getProfile(req.user.username);
    if (!profile) throw new NotFoundException();
    return { ...profileToProfileResponse(profile), tfa: profile.user.tfa };
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
    @Req() req: Request,
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
    if (req.user === undefined) throw new UnauthorizedException();
    this.profilesService.changeAvatarFromUpload(req.user.userId, avatar);
  }

  @ApiBody({ type: DisplayNameDto })
  @ApiOperation({ summary: 'Update display name of current user' })
  @Post('/display-name')
  async updateDisplayName(
    @Req() req: Request,
    @Body() displayNameDto: DisplayNameDto,
  ) {
    if (req.user === undefined) throw new UnauthorizedException();
    await this.profilesService.updateDisplayName(
      req.user.userId,
      displayNameDto.displayName,
    );
  }

  @ApiResponse({ type: [ProfileResponse] })
  @ApiQuery({ name: 'displayname', type: 'string' })
  @ApiOperation({ summary: 'Autocomplete profiles' })
  @Get('/autocomplete')
  async autocompleteProfile(
    @Req() req: Request,
    @Query('displayname') displaynameLike: string,
  ): Promise<ProfileResponse[]> {
    if (req.user === undefined) throw new UnauthorizedException();
    const profiles: Profile[] =
      await this.profilesService.autocompleteDisplayname(
        req.user.userId,
        displaynameLike,
      );

    return profiles.map((value) => {
      return profileToProfileResponse(value);
    });
  }
}
