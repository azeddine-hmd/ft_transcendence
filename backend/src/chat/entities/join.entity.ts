import { Column, Entity, Index, JoinTable, Long, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Rooms } from "./rooms.entity";
import { Users } from "./users.entity";

@Entity()
export class Join {
    @PrimaryColumn()
    uid: number;

    @PrimaryColumn()
    rid: number;

    @ManyToOne(() => Users, (user) => user.id)
    user: number;

    @ManyToOne(type => Rooms, (room) => room.id)
    room: number;
}