import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Column } from 'typeorm/decorator/columns/Column';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
import { User } from './user.entity';

@Entity()
export class UserRelation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user, {
    cascade: true,
  })
  // @JoinColumn()
  user1: User;

  @ManyToOne(() => User, (user) => user, {
    cascade: true,
  })
  // @JoinColumn()
  user2: User;

  @Column()
  isFriend: boolean;

  @Column()
  isBlocked: boolean;
}
