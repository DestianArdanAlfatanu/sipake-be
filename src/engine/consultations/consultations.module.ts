import { Module } from '@nestjs/common';
import { ConsultationsService } from './consultations.service';
import { ConsultationsController } from './consultations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Problem } from '../problems/entities/problem.entity';
import { User } from '../../users/entities/user.entity';
import { Solution } from '../solutions/entities/solution.entity';
import { Rule } from '../rules/entities/rule.entity';
import { RulesModule } from '../rules/rules.module';
import { ConsultationHistory } from './entities/consultation_history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Problem,
      Solution,
      Rule,
      ConsultationHistory
    ]),
    RulesModule,
  ],
  controllers: [ConsultationsController],
  providers: [ConsultationsService],
})
export class ConsultationsModule {}
