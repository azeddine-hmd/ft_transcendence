import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('game_user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;
}
