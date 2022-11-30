import {
  Controller,
  Get,
  Param,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuth } from 'src/auth/guards/jwt-auth.guard';
import { profileToProfileResponse } from 'src/profiles/utils/entity-payload-converter';
import { GameProfile } from './dto/response/game-profile-response';
import { GameMatch } from './game-match.entity';
import GameService from './game.service';

@ApiTags('games')
@ApiBearerAuth()
@JwtAuth
@Controller('games')
export class GamesController {
  constructor(private readonly gameService: GameService) {}

  @ApiOperation({ summary: 'list of all game matches of current user' })
  @Get('all')
  async getAllMatchs(@Req() req: Request) {
    if (!req.user) throw new UnauthorizedException();
    const gameMatches = await this.gameService.getAllMatchs(req.user.username);
    return gameMatches.map((match: GameMatch) => {
      const { winner, loser, id, ...rest } = match;
      return {
        winner: profileToProfileResponse(match.winner.profile),
        loser: profileToProfileResponse(match.loser.profile),
        ...rest,
      };
    });
  }

  @ApiOperation({ summary: 'list of all game matches of other user' })
  @Get('matches/:username')
  async getOtherMatchs(
    @Req() req: Request,
    @Param('username') otherUsername: string,
  ) {
    if (!req.user) throw new UnauthorizedException();
    const gameMatches = await this.gameService.getAllMatchs(otherUsername);
    return gameMatches.map((match: GameMatch) => {
      const { winner, loser, id, ...rest } = match;
      return {
        winner: profileToProfileResponse(match.winner.profile),
        loser: profileToProfileResponse(match.loser.profile),
        ...rest,
      };
    });
  }

  @ApiOperation({ summary: 'get current user game profile' })
  @Get()
  async getGameProfile(@Req() req: Request): Promise<GameProfile> {
    if (req.user === undefined) throw new UnauthorizedException();
    const gameProfile = await this.gameService.getProfileGame(
      req.user.username,
    );
    return {
      total_games: gameProfile.totalGames,
      total_wins: gameProfile.totalWins,
      total_loss: gameProfile.totalLoss,
      percent_pation: gameProfile.percentPation,
      rank: gameProfile.rank,
      points: gameProfile.rank,
      xp: gameProfile.xp,
      percent_level: gameProfile.percentLevel,
      level: gameProfile.level,
    };
  }

  @ApiOperation({
    summary: 'get other user game profile',
  })
  @Get('/username/:username')
  async getSomeoneGameProfile(
    @Req() req: Request,
    @Param('username') otherUsername: string,
  ): Promise<GameProfile> {
    const gameProfile = await this.gameService.getProfileGame(otherUsername);
    return {
      total_games: gameProfile.totalGames,
      total_wins: gameProfile.totalWins,
      total_loss: gameProfile.totalLoss,
      percent_pation: gameProfile.percentPation,
      rank: gameProfile.rank,
      points: gameProfile.rank,
      xp: gameProfile.xp,
      percent_level: gameProfile.percentLevel,
      level: gameProfile.level,
    };
  }
}
