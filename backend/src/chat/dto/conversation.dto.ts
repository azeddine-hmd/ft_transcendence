import { IsNumber, IsString } from 'class-validator'
export class ConversationDto {
    
    @IsNumber()
    user: number;
}