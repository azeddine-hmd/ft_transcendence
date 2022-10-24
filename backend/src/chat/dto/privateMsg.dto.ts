import { IsNumber, IsString } from 'class-validator'
export class PrivateMsgDto {
    
    @IsNumber()
    user: string;

    @IsNumber()
    msg: string;
}