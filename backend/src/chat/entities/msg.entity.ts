import { Column, Entity, Index, JoinTable, Long, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Rooms } from "./rooms.entity";
import { Users } from "./users.entity";

@Entity()
export class Msg {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Users, (user) => user.id)
    user: Users;
    
    @Index()
    @ManyToOne(type => Rooms, (room) => room.id)
    room: Rooms;

    @Column()
    msg: string;
}