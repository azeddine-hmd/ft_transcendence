import { IsNumber, IsString } from 'class-validator'
export class PrivateMsgDto {
    
    @IsNumber()
    user: number;

    @IsNumber()
    msg: string;
}