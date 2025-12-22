import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SuspensionProblem } from './problems/entities/problems.entity';
import { SuspensionSymptom } from './symptoms/entities/symptoms.entity';
import { SuspensionRule } from './rules/entities/rules.entity';
import { SuspensionSolution } from './solutions/entities/solutions.entity';
import { User } from '../users/entities/user.entity';
import { ConsultationHistory } from '../engine/consultations/entities/consultation_history.entity';

import { SuspensionProblemsService } from './problems/problems.service';
import { SuspensionProblemsController } from './problems/problems.controller';

import { SuspensionSymptomsService } from './symptoms/symptoms.service';
import { SuspensionSymptomsController } from './symptoms/symptoms.controller';

import { SuspensionRulesService } from './rules/rules.service';
import { SuspensionRulesController } from './rules/rules.controller';

import { SuspensionSolutionsService } from './solutions/solutions.service';
import { SuspensionSolutionsController } from './solutions/solutions.controller';

import { SuspensionConsultationsModule } from './consultations/consultations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SuspensionProblem,
      SuspensionSymptom,
      SuspensionRule,
      SuspensionSolution,
      User,
      ConsultationHistory,
    ]),
    SuspensionConsultationsModule,
  ],
  controllers: [
    SuspensionProblemsController,
    SuspensionSymptomsController,
    SuspensionRulesController,
    SuspensionSolutionsController,
  ],
  providers: [
    SuspensionProblemsService,
    SuspensionSymptomsService,
    SuspensionRulesService,
    SuspensionSolutionsService,
  ],
  exports: [
    SuspensionProblemsService,
    SuspensionSymptomsService,
    SuspensionRulesService,
    SuspensionSolutionsService,
    SuspensionConsultationsModule,
  ],
})
export class SuspensionModule { }
