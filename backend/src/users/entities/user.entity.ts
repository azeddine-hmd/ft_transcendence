import { Profile } from 'src/profiles/entities/profile.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRelation } from './user-relation.entity';

@Entity('game_user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

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
}
