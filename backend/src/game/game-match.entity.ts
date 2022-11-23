import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class GameMatch {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    @JoinColumn()
    winner: User;
  
    @ManyToOne(() => User)
    @JoinColumn()
    loser: User;

    @Column()
    winnerScore: number;

    @Column()
    loserScore: number;

    @Column()
    mode: string;

    @Column({default: 0 })
    totalGames: number;

    @Column({default: 0 })
    totalWins: number;

    @Column({default: 0 })
    totalLoss: number;

    @Column({ default: 0 })
    percentPation: number;

    @Column({ nullable: true })
    rank: number;

    @Column({default: 1000 })
    points: number;

    @Column({  default: 0 })
    xp: number;

    @Column({ default: 0 })
    percentLevel: number;

    @Column({default: 1 })
    level: number;
}
