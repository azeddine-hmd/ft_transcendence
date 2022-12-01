import { IsAlphanumeric, IsNumber, IsString, Length } from 'class-validator'
export class JoinRoomDto {  
    @IsNumber()
    roomId: number;

    privacy: boolean;
    
    @IsAlphanumeric()
    @Length(1, 20)
    @IsString()
    password: string;
    // { roomId: 1 }
}