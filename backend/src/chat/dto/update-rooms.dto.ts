import { IsAlphanumeric, IsBoolean, IsNumber, IsString, Length } from 'class-validator'
import { Users } from '../entities/users.entity';
export class UpdateRoomDto {

    @IsBoolean()
    privacy: boolean;

    @IsAlphanumeric()
    @Length(2, 20)
    @IsString()
    password: string;

    @IsNumber()
    roomID: number;
}