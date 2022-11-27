import { IsNumber, IsString } from 'class-validator'
export class AcceptDto {
    
    @IsString()
    username: string;
}