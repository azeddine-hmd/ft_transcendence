import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/profiles/entities/profile.entity';
import { UsersService } from 'src/users/services/users.service';
import { Repository } from 'typeorm';
import { GameMatch} from './game-match.entity';
import { Matchs } from './game-queue';

@Injectable()
export default class GameService {
  matches: Matchs = [[], []];

  constructor(
    @InjectRepository(GameMatch)
    private gameRepository: Repository<GameMatch>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    private usersService: UsersService,
  ) {}

	async getAllMatchs(): Promise<GameMatch[]> {
		return await this.gameRepository.find({
      relations: {
        winner: { profile: true },
        loser: { profile: true },
      }
    });
	}
  // async updateAllRanks() {
	// 	const all = await this.gameRepository.createQueryBuilder("user").orderBy("user.points", "DESC").getMany();
	// 	all.forEach((user: GameMatch, index: 1) => 
  //   {
	// 		user.rank = index + 1;
	// 		this.gameRepository.save(user);
	// 	});
	// }

	async updateResault(user: GameMatch, isWin: boolean) 
  {
		if(isWin)
      user.points += 100
    else
      user.points -= 50;
		if(isWin) 
      user.xp += 100 
    else
      user.xp -= 50;
		if(isWin)
      user.totalWins += 1;
    else
       user.totalLoss += 1;
		user.totalGames += 1;
		if (user.xp >= ((2 ^ (user.level - 1)) * 100)) 
    {
			user.level += 1;
			user.xp = 0;
		}
		user.percentLevel = ((user.xp / ((2 ** (user.level - 1)) * 100)) * 100)
		user.percentPation = (user.totalWins) / (user.totalGames) * 100;
		await this.gameRepository.save(user);
	}

  async createGameMatch(opts: {
      winner: string;
      loser: string;
      winnerScore: number;
      loserScore: number;
      mode: string;
    }) 
    {
      // await this.updateResault(opts.winner, true);
		  // await this.updateResault(opts.loser, false);
      // await this.updateAllRanks();
      const winnderUser = await this.usersService.findOneFromUsername(opts.winner);
      const loserUser = await this.usersService.findOneFromUsername(opts.loser);
      if (!winnderUser || !loserUser) 
        throw new InternalServerErrorException();
      const gameMatch = this.gameRepository.create({
        winner: winnderUser,
        loser: loserUser,
        winnerScore: opts.winnerScore,
        loserScore: opts.loserScore,
        mode: opts.mode,
      });
      await this.gameRepository.save(gameMatch);
  }

  getMatch(login: string) {
		return "_users.games";
  }
}

