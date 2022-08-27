import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Rooms } from "./rooms.entity";


@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}
