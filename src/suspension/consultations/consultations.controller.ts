import { Controller, Post, Body, Get } from '@nestjs/common';
import { ConsultationsService } from './consultations.service';
import { ConsultationProcessDto } from './dto/consultation-process.dto';

@Controller('suspension/consultations')
export class ConsultationsController {
  constructor(private svc: ConsultationsService) {}

  @Get('start')
  start() {
    return this.svc.start();
  }

  @Post('process')
  async process(@Body() dto: ConsultationProcessDto) {
    // if you have auth, replace 'guest' with actual username from req.user
    const username = 'guest';
    return this.svc.process(username, dto);
  }
}
