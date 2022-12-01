import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/profiles/entities/profile.entity';
import { UsersService } from 'src/users/services/users.service';
import { Repository } from 'typeorm';
import { GameMatch } from './game-match.entity';
import { Matchs } from './game-queue';
import { MatchsChat } from './game-queue';

@Injectable()
export default class GameService {
  matches: Matchs = [[], []];
  matchesChat: MatchsChat = [[], []];
  playr: string | null = null;
  playr2: string | null = null;

  constructor(
    @InjectRepository(GameMatch)
    private gameRepository: Repository<GameMatch>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    private usersService: UsersService,
  ) {}

  async getAllMatchs(username: string): Promise<GameMatch[]> {
    return await this.gameRepository.find({
      relations: {
        winner: { profile: { user: true } },
        loser: { profile: { user: true } },
      },
      where: [
        { winner: { username: username } },
        { loser: { username: username } },
      ],
    });
  }

  private async Resault(username: string, isWin: boolean) {
    const profile = await this.profileRepository.findOne({
      relations: {
        user: true,
      },
      where: {
        user: { username: username },
      },
    });
    if (!profile)
      throw new InternalServerErrorException(
        "while saving result could't save profile not found",
      );

    if (isWin) profile.points += 100;
    else {
      if (profile.points - 50 < 0) profile.points = 0;
      else profile.points -= 50;
    }
    if (isWin) profile.xp += 100;
    else {
      if (profile.xp - 50 < 0) profile.xp = 0;
      else profile.xp -= 50;
    }
    if (isWin) profile.totalWins += 1;
    else profile.totalLoss += 1;
    profile.totalGames += 1;
    if (profile.xp >= 2 ** (profile.level - 1) * 100) {
      profile.level += 1;
      profile.xp = 0;
    }
    profile.percentLevel =
      (profile.xp / (2 ** (profile.level - 1) * 100)) * 100;
    profile.percentPation = (profile.totalWins / profile.totalGames) * 100;
    if (isWin) {
      profile.rank += 1;
    }
    await this.profileRepository.save(profile);
  }

  async createGameMatch(opts: {
    winner: string;
    loser: string;
    winnerScore: number;
    loserScore: number;
    mode: string;
  }) {
    await this.Resault(opts.winner, true);
    await this.Resault(opts.loser, false);
    const winnderUser = await this.usersService.findOneFromUsername(
      opts.winner,
    );
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

  async getProfileGame(username: string): Promise<Profile> {
    const profile = await this.profileRepository.findOneBy({
      user: { username: username },
    });
    if (!profile) throw new NotFoundException('profile game not found');
    return profile;
  }
}
