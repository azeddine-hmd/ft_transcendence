import { IsNumber, IsString } from 'class-validator'
export class BanDto {
    
    @IsString()
    user: string;

    @IsNumber()
    time: number;

    @IsNumber()
    room: number;
}