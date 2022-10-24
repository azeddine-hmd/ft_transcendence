import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, Index, JoinTable, Long, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";

@Entity()
export class DM {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, (user) => user.id)
    sender: User;

    @ManyToOne(() => User, (user) => user.id)
    receiver: User;

    @Column()
    message: string;

    @CreateDateColumn()
    date: Date;
}