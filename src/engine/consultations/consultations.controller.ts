import { Controller, Post, Body, Get, HttpCode } from '@nestjs/common';
import { ConsultationsService } from './consultations.service';
import { ConsultationProcessDto } from './dto/consultation-process.dto';

@Controller('engine/consultations')
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Get('start')
  start() {
    return this.consultationsService.start();
  }

  @Post('process')
  @HttpCode(200)
  async process(@Body() dto: ConsultationProcessDto) {
    const username = 'guest'; // Bisa diganti logic auth user
    return this.consultationsService.process(username, dto);
  }
}