import { Rooms } from '../../chat/entities/rooms.entity';
import { Profile } from '../../profiles/entities/profile.entity';

import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { UserRelation } from './user-relation.entity';

@Entity('game_user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({
    unique: true,
    update: false,
    generated: 'uuid',
  })
  userId: string;

  @Column({
    type: 'int',
    nullable: true,
    update: false,
  })
  ftId: number | null;

  @Column({
    unique: true,
    update: false,
  })
  username: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  password: string | null;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  token: string | null;

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;

  @OneToMany(() => UserRelation, (userRelation) => userRelation, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  relations: UserRelation[];

  @OneToMany(() => Rooms, (room) => room.owner)
  rooms: Rooms[];

}
