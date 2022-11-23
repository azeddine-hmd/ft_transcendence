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

    @Column({ nullable: true, default: 0 })
    totalGames: number;

    @Column({ nullable: true, default: 0 })
    totalWins: number;

    @Column({ nullable: true, default: 0 })
    totalLoss: number;

    @Column({ nullable: true, type: 'decimal', precision: 5, scale: 2, default: 0 })
    ration: number;

    @Column({ nullable: true })
    rank: number;

    @Column({ nullable: true, default: 1000 })
    points: number;

    @Column({ nullable: true, default: 0 })
    xp: number;

    @Column({ nullable: true, type: 'decimal', precision: 5, scale: 2, default: 0 })
    percentLevel: number;

    @Column({ nullable: true, default: 1 })
    level: number;
}
