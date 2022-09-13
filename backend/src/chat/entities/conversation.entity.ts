import { Column, Entity, Index, JoinTable, Long, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";

@Entity()
export class Conversation {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Users, (user) => user.id)
    user1: Users;

    @ManyToOne(() => Users, (user) => user.id)
    user2: Users;
}