import { IsNumber } from 'class-validator'
export class KickDto {  
    @IsNumber()
    roomId: number;

    user: string;

}