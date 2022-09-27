import { Profile } from '../../profiles/entities/profile.entity';
import { Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Column } from 'typeorm/decorator/columns/Column';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
import { User } from './user.entity';

@Entity()
export class UserRelation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, {
    cascade: true,
  })
  @JoinColumn()
  user1: User;

  @ManyToOne(() => User, {
    cascade: true,
  })
  @JoinColumn()
  user2: User;

  @OneToOne(() => Profile)
  @JoinColumn()
  profile: Profile;

  @Column({
    default: false,
  })
  PendingFriend1_2: boolean;

  @Column({
    default: false,
  })
  PendingFriend2_1: boolean;

  @Column({
    default: false,
  })
  isFriend: boolean;

  @Column({
    default: false,
  })
  isBlocked: boolean;
}
