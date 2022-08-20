import { IsBoolean, IsNumber, IsString } from 'class-validator'
export class CreateRoomDto {
    @IsBoolean()
    readonly privacy: boolean;

    @IsNumber()
    readonly owner: number;
}
