import { IsNumber } from 'class-validator'
export class JoinRoomDto {

    @IsNumber()
    userId: number;
    
    @IsNumber()
    roomId: number;
}