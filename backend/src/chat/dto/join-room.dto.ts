import { IsNumber } from 'class-validator'
export class JoinRoomDto {  
    @IsNumber()
    roomId: number;

    privacy: boolean;
    
    password: string;
    // { roomId: 1 }
}