import { Controller, Get, Injectable, Logger, Res } from '@nestjs/common';
import { Socket } from 'net';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

}
