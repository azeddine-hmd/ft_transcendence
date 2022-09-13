import { Column, Entity, Index, JoinTable, Long, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";

@Entity()
export class DM {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Users, (user) => user.id)
    sender: Users;

    @ManyToOne(() => Users, (user) => user.id)
    receiver: Users;

    @Column()
    message: string;
}