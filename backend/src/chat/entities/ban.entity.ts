import { User } from "src/users/entities/user.entity";
import { Column, Entity, Index, JoinTable, Long, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Rooms } from "./rooms.entity";

@Entity()
export class Ban {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, (user) => user.id)
    user1: User;

    @ManyToOne(() => User, (user) => user.id)
    user2: User;

    @Column()
    limit_time: number;

    @ManyToOne(type => Rooms, (room) => room.id)
    room: number;


    @Column()
    time: Date;
}