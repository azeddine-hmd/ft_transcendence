import {
  Body,
  Get,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Req,
} from '@nestjs/common';
import { Controller } from '@nestjs/common/decorators/core/controller.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger/dist';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AddUserRelationDto } from '../dto/payload/add-user-relation.dto';
import { UserRelation } from '../entities/user-relation.entity';
import { RelationsService } from '../services/relations.service';

@ApiTags('user relations')
@ApiBearerAuth()
@JwtAuthGuard
@Injectable()
@Controller('api/users')
export class RelationsController {
  constructor(private readonly relationsService: RelationsService) {}

  @ApiResponse({
    status: 200,
    description: 'add relation between two users',
  })
  @ApiBody({
    type: AddUserRelationDto,
  })
  @Post('/add')
  async addUserRelation(
    @Req() req: any,
    @Body() addUserRelationDto: AddUserRelationDto,
  ): Promise<UserRelation> {
    const relation = await this.relationsService.addUserRelation(
      req.user.userId,
      addUserRelationDto,
    );
    if (!relation) {
      //TODO: return informative error
      throw new NotFoundException();
    }
    return relation;
  }

  @ApiResponse({
    status: 200,
    description: 'get all friend of current logged-in user',
  })
  @ApiBody({
    type: UserRelation,
    isArray: true,
  })
  @Get('/friends')
  async getFriends(@Req() req: any) {
    const UserRelation = await this.relationsService.getAllFriends(
      req.user.userId,
    );
    if (!UserRelation) throw new InternalServerErrorException();
    return UserRelation;
  }
}
