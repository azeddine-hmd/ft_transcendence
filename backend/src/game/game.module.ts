
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from 'src/profiles/entities/profile.entity';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { GameMatch } from './game-match.entity';
import { GamesController } from './game.controller';
import { GameGateway } from './game.gateway';
import GameService from './game.service';


@Module({
    imports: [
        TypeOrmModule.forFeature([GameMatch, Profile]),
        ProfilesModule,
    ],
    controllers: [GamesController],
    providers: [GameService, GameGateway],
    exports: [GameService],
})
export class GameModule {
    
 }
