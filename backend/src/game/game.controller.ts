import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Controller, Get, Param } from '@nestjs/common';
import  UserService  from './game.service';
import { JwtAuth } from 'src/auth/guards/jwt-auth.guard';
import GameService from './game.service';
import { GameMatch } from './game-match.entity';

@ApiTags('games')
@ApiBearerAuth()
@JwtAuth
@Controller('games')
export class GamesController {
    constructor(
        private readonly gameService: GameService,
    ) {}

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
