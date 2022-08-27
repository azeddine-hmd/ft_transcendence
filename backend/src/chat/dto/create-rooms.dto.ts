import { IsBoolean, IsNumber, IsString } from 'class-validator'
import { Users } from '../entities/users.entity';
export class CreateRoomDto {

    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsBoolean()
    readonly privacy: boolean;

    @IsNumber()
    readonly owner: Users;
}