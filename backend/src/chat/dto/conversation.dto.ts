import { IsNumber, IsString } from 'class-validator'
export class ConversationDto {
    
    @IsString()
    user: string;
}