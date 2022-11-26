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
}
