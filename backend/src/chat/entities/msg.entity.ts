import { User } from "src/users/entities/user.entity";
import { Column, Entity, Index, JoinTable, Long, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Rooms } from "./rooms.entity";
import { Users } from "./users.entity";

@Entity()
export class Msg {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, (user) => user.id)
    user: User;
    
    @Index()
    @ManyToOne(type => Rooms, (room) => room.id)
    room: Rooms;

    @Column()
    msg: string;

    @Column()
    @Index()
    date: Date;
}