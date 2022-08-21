import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room-dto';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {

    constructor(private readonly roomsService: RoomsService)
    {

    }


    @Get()
    findAll()
    {
        return this.roomsService.findAll();
    }

    @Post()
    create(@Body() createRoomDto: CreateRoomDto)
    {
        // return body;
        return this.roomsService.create(createRoomDto);
    }

}
