import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './dto/create-room-dto';
import { Rooms } from './entities/rooms.entity';
import { Users } from './entities/users.entity';

@Injectable()
export class RoomsService {
    constructor(
        @InjectRepository(Rooms)
        private readonly roomRepository: Repository<Rooms>,
    )
    {}

    async findAll()
    {
        const users = await this.roomRepository
        .createQueryBuilder("room")
        .leftJoinAndSelect("room.owner", "owner") 
        // .andWhere("room.id = :r", {r: 5})
        // .where("owner.id = :id", { id: 5 })
        .where("room.privacy = :p", { p: false })
        .andWhere("owner.id = :r", {r: 5})
        .getOne();
        console.log("users ==> ", users)
        return users;
        // const users = await this.roomRepository.find({
        //     relations: ['owner'],
        // });

        // const res = new Array();

        // users.forEach(element => {
        //     res.push(element.owner);
        // });
        // return res;
        // .select(['room.id', 'room.privacy', 'room.owner']).getMany();
        // return this.roomRepository
        // .createQueryBuilder("room")
        // .innerJoin("room.owner", "users") 
        // .select(['room.id', 'room.privacy', 'room.owner'])
        // .getMany();
    }

    create(createRoomDto: CreateRoomDto)
    {
        const room = this.roomRepository.create(createRoomDto);
        return this.roomRepository.save(room);
    }
}
function getOne() {
    throw new Error('Function not implemented.');
}

