import { Column, Entity, Index, JoinTable, Long, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";

@Entity()
export class Rooms {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    privacy: boolean;

    @Column()
    password: string;

    @Column()
    @Index()
    date: Date;

    @ManyToOne(type => Users, (user) => user.id)
    owner: Users;
}
