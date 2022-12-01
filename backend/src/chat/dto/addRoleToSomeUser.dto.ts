import { IsAlphanumeric, IsNumber, IsString, Length } from 'class-validator'
export class AddRoleToSomeUserDto {

    @IsAlphanumeric()
    @Length(2, 20)
    @IsString()
    username: string;

    @IsNumber()
    roomId: number;

}