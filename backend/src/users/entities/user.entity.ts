import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('game_user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  ftId: number;

  @Column({
    unique: true,
  })
  username: string;

  @Column({
    nullable: true,
  })
  password: string;

  @Column({
    nullable: true,
  })
  profileImageUrl: string;
}
