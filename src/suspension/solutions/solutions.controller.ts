import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { SuspensionSolutionsService } from './solutions.service';
import { CreateSolutionDto } from './dto/create-solution.dto';
import { UpdateSolutionDto } from './dto/update-solution.dto';

@Controller('suspension/solutions')
export class SuspensionSolutionsController {
  constructor(private svc: SuspensionSolutionsService) {}

  @Post()
  create(@Body() dto: CreateSolutionDto) {
    return this.svc.create(dto);
  }

  @Get()
  findAll() {
    return this.svc.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.svc.findOne(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateSolutionDto) {
    return this.svc.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.svc.remove(Number(id));
  }
}
