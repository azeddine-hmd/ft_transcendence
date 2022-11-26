import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Controller, Get, Param, Req, UnauthorizedException } from '@nestjs/common';
import { JwtAuth } from 'src/auth/guards/jwt-auth.guard';
import GameService from './game.service';
import { GameMatch } from './game-match.entity';
import { Request } from 'express';
import { GameProfile } from './dto/response/game-profile-response';

@ApiTags('games')
@ApiBearerAuth()
@JwtAuth
@Controller('games')
export class GamesController {
    constructor(
        private readonly gameService: GameService,
    ) {}

    @ApiOperation({ summary: 'get current user game profile' })
    @Get()
    async getGameProfile(@Req() req: Request): Promise<GameProfile> {
        if (req.user === undefined) throw new UnauthorizedException();
        const profile = await this.gameService.getProfileGame(req.user.username);
        return {
            total_games: profile.totalGames,
            total_wins: profile.totalWins,
            total_loss: profile.totalLoss,
            percent_pation: profile.percentPation,
            rank: profile.rank,
            points: profile.rank,
            xp: profile.xp,
            percent_level: profile.percentLevel,
            level: profile.level,
        };
    }

    @Get('all')
    async getAllMatchs() {
        const gameMatches = await this.gameService.getAllMatchs();
        return gameMatches.map((value: GameMatch) => {
            const { winner, loser, id, ...rest } = value;
            return {
                winner: winner.profile.displayName,
                loser: loser.profile.displayName,
                ...rest,
            }
        });
    }



}
