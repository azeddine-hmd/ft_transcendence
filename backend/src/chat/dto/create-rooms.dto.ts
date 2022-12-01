import { IsAlphanumeric, IsBoolean, IsNumber, IsString, Length } from 'class-validator'
import { Users } from '../entities/users.entity';
export class CreateRoomDto {

    @Length(2, 30)
    @IsAlphanumeric()
    @IsString()
    title: string;

    @Length(2, 50)
    @IsAlphanumeric()
    @IsString()
    description: string;

    @IsBoolean()
    privacy: boolean;

    @Length(2, 20)
    @IsAlphanumeric()
    @IsString()
    password: string;

    date: Date;

}