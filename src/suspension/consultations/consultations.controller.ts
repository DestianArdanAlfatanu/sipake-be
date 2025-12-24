import { Controller, Post, Body, Get, HttpCode, UseGuards, Request } from '@nestjs/common';
import { SuspensionConsultationsStepService } from './consultations-step.service';
import { ConsultationProcessStepDto } from './dto/consultation-process-step.dto';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('suspension-consultations')
export class SuspensionConsultationsController {
  constructor(private readonly consultationsService: SuspensionConsultationsStepService) { }

  @Get('start')
  start() {
    return this.consultationsService.start();
  }

  // Endpoint untuk mengambil riwayat konsultasi user
  @UseGuards(AuthGuard)
  @Get('histories')
  async getHistories(@Request() req) {
    // req.username didapat dari AuthGuard (line 29 di auth.guard.ts)
    return this.consultationsService.getHistories(req.username);
  }

  @UseGuards(AuthGuard)
  @Post('process')
  @HttpCode(200)
  async process(@Body() dto: ConsultationProcessStepDto, @Request() req) {
    // Ambil username dari token JWT, fallback ke 'guest' jika tidak ada
    const username = req.username || 'guest';
    return this.consultationsService.process(username, dto);
  }
}
