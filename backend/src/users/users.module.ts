import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Profile } from '../profiles/entities/profile.entity';
import { RelationsController } from './controllers/relations.controller';
import { UsersController } from './controllers/users.controller';
import { UserRelation } from './entities/user-relation.entity';
import { User } from './entities/user.entity';
import { RelationsService } from './services/relations.service';
import { UsersService } from './services/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRelation, Profile]),
    AuthModule,
  ],
  providers: [UsersService, RelationsService],
  exports: [UsersService],
  controllers: [UsersController, RelationsController],
})
export class UsersModule {}
