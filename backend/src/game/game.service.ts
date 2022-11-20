import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/profiles/entities/profile.entity';
import { UsersService } from 'src/users/services/users.service';
import { Repository } from 'typeorm';
import { GameMatch } from './game-match.entity';
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

  async createGameMatch(opts: {
      winner: string;
      loser: string;
      winnerScore: number;
      loserScore: number;
      mode: string;
    }) {
      const winnderUser = await this.usersService.findOneFromUsername(opts.winner);
      const loserUser = await this.usersService.findOneFromUsername(opts.loser);
      if (!winnderUser || !loserUser) throw new InternalServerErrorException();
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
