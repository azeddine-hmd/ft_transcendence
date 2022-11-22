import { User } from "src/users/entities/user.entity";
import { Column, Entity, Index, JoinTable, Long, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Block {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, (user) => user.id)
    user1: User;

    @ManyToOne(() => User, (user) => user.id)
    user2: User;
}