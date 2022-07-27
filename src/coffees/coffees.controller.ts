import {
    Body,
    Controller,
    Post,
    Get,
    Param,
    HttpCode,
    HttpStatus,
    Res,
    Patch,
    Delete,
    Query
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';


@Controller('coffees')
export class CoffeesController {
    constructor(private readonly coffeesService: CoffeesService)
    {

    }

    @Get()
    findAll(@Query() paginationQuery) {
        // const { limit, offset } = paginationQuery;
        // return `This action returns all coffees. Limit: ${limit}, offset: ${offset}`;
        return this.coffeesService.findAl();
    }

    @Get(':id')
    findOne(@Param('id') id: string)
    {
        // return `This action ruturns #${id} coffee`
        return this.coffeesService.findOne(id);
    }

    @Post()
    create(@Body() CreateCoffeeDto: CreateCoffeeDto)
    {
        // return body;
        return this.coffeesService.create(CreateCoffeeDto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() UpdateCoffeeDto: UpdateCoffeeDto)
    {
        // return `This action updates #${id} coffee`;
        return this.coffeesService.update(id, UpdateCoffeeDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string)
    {
        // return `This action remove #${id} coffee`;
        return this.coffeesService.remove(id);
    }
}