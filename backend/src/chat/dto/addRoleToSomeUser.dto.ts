import { IsNumber, IsString } from 'class-validator'
export class AddRoleToSomeUserDto {

    @IsString()
    userId: string;

    @IsNumber()
    roomId: number;

}