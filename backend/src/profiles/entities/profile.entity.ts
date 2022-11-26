import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.profile, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @Column({
    unique: true,
  })
  displayName: string;

  @Column()
  avatar: string;

  @Column({default: 0 })
  totalGames: number;

  @Column({default: 0 })
  totalWins: number;

  @Column({default: 0 })
  totalLoss: number;

  @Column({
    type: 'float',
    scale: 2, 
    default: 0.0,
  })
  percentPation: number;

  @Column( {default: 0})
  rank: number;

  @Column({default: 1000 })
  points: number;

  @Column({  default: 0 })
  xp: number;

  @Column({
    type: 'float',
    scale: 2,
    default: 0.0,
  })
  percentLevel: number;

  @Column({default: 1 })
  level: number;
}
