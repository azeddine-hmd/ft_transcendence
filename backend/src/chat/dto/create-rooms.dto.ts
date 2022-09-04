import { IsBoolean, IsNumber, IsString } from 'class-validator'
import { Users } from '../entities/users.entity';
export class CreateRoomDto {

    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsBoolean()
    privacy: boolean;

    @IsString()
    password: string;

    date: Date;

    owner: {
        id: number,
        name: string,
    };
}