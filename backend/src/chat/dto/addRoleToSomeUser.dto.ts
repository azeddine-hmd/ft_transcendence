import { IsNumber, IsString } from 'class-validator'
export class AddRoleToSomeUserDto {

    @IsString()
    username: string;

    @IsNumber()
    roomId: number;

}