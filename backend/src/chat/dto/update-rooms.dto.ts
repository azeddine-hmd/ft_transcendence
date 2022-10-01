import { IsBoolean, IsNumber, IsString } from 'class-validator'
import { Users } from '../entities/users.entity';
export class UpdateRoomDto {

    @IsBoolean()
    privacy: boolean;

    @IsString()
    password: string;

}