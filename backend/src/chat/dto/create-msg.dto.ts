import { IsAlphanumeric, IsNumber, IsString, Length } from 'class-validator'
import { Users } from '../entities/users.entity';
export class CreateMsgDto {
    
    @IsNumber()
    room: number;

    @IsAlphanumeric()
    @Length(1, 1000)
    @IsString()
    msg: string;

    date: Date;
}