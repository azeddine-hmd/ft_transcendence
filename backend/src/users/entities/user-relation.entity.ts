import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Column } from 'typeorm/decorator/columns/Column';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
import { User } from './user.entity';

@Entity()
export class UserRelation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn()
  user1: User;

  @ManyToOne(() => User)
  @JoinColumn()
  user2: User;

  @Column({
    default: false,
  })
  friend1_2: boolean;

  @Column({
    default: false,
  })
  friend2_1: boolean;

  @Column({
    default: false,
  })
  isBlocked: boolean;
}
