import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { SuspensionRulesService } from './rules.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';

@Controller('suspension/rules')
export class SuspensionRulesController {
  constructor(private svc: SuspensionRulesService) {}

  @Post()
  create(@Body() dto: CreateRuleDto) {
    return this.svc.create(dto);
  }

  @Get()
  findAll() {
    return this.svc.findAll();
  }

  @Get('problem/:problemId')
  findByProblem(@Param('problemId') problemId: string) {
    return this.svc.findByProblem(problemId);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.svc.findOne(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateRuleDto) {
    return this.svc.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.svc.remove(Number(id));
  }
}
