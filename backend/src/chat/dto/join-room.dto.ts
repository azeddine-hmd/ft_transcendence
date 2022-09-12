import { IsNumber } from 'class-validator'
export class JoinRoomDto {  
    @IsNumber()
    roomId: number;

    // { roomId: 1 }
}