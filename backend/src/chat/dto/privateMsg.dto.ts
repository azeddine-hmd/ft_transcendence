import { IsAlphanumeric, IsNumber, IsString, Length } from 'class-validator'
export class PrivateMsgDto {
    
    @IsNumber()
    user: string;

    @IsAlphanumeric()
    @Length(1, 1000)
    @IsNumber()
    msg: string;
}