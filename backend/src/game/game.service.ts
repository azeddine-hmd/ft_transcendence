import { Injectable, NotFoundException } from '@nestjs/common';

import { getDataSourceToken, InjectRepository } from '@nestjs/typeorm';

import { DataSource, Repository } from 'typeorm';


import { join } from 'path';

import { User } from 'src/users/entities/user.entity';

let roomsusers = new Map<number, number[]>();

@Injectable()
export class GameService {
  constructor()
  {}

}
