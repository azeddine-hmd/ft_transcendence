import { join } from "path";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Rooms } from "./rooms.entity";


@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    // @JoinTable()
    @ManyToMany(type => Rooms, (room) => room.id)
    room: Rooms[];
}
