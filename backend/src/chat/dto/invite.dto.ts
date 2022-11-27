import { IsNumber, IsString } from 'class-validator'
export class InviteDto {
    
    @IsString()
    user: string; 
    
    roomId: number;
}