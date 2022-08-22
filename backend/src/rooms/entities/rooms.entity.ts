import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { JoinAttribute } from "typeorm/query-builder/JoinAttribute";
import { Users } from "./users.entity";

@Entity()
export class Rooms {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    privacy: boolean;

    @ManyToOne(type => Users, (user) => user.id)
    owner: number;
}
