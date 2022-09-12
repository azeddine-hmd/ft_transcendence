import { Length, Matches } from 'class-validator';

export class CreateUserDto {
  // @Length(6, 10)
  // @Matches(/^[A-Za-z0-9]+(?:[_-][A-Za-z0-9]+)*$/)
  username: string;

  // @Length(8, 16)
  // @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/)
  password: string;
}
