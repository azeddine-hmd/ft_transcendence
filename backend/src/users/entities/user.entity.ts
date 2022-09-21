import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRelation } from './user-relation.entity';

@Entity('game_user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    nullable: true,
    update: false,
    default: null,
  })
  ftId?: number | null;

  @Column({
    unique: true,
  })
  username: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  password?: string | null;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  token?: string | null;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  avatar?: string | null;

  @OneToMany(() => UserRelation, (userRelation) => userRelation, {
    cascade: true,
  })
  @JoinColumn()
  relations: UserRelation[];
}
