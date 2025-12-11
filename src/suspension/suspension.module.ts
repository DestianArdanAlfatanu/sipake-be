import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SuspensionProblem } from './problems/entities/problems.entity';
import { SuspensionSymptom } from './symptoms/entities/symptoms.entity';
import { SuspensionRule } from './rules/entities/rules.entity';
import { SuspensionSolution } from './solutions/entities/solutions.entity';

import { SuspensionProblemsService } from './problems/problems.service';
import { SuspensionProblemsController } from './problems/problems.controller';

import { SuspensionSymptomsService } from './symptoms/symptoms.service';
import { SuspensionSymptomsController } from './symptoms/symptoms.controller';

import { SuspensionRulesService } from './rules/rules.service';
import { SuspensionRulesController } from './rules/rules.controller';

import { SuspensionSolutionsService } from './solutions/solutions.service';
import { SuspensionSolutionsController } from './solutions/solutions.controller';

import { ConsultationsService } from './consultations/consultations.service';
import { ConsultationsController } from './consultations/consultations.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SuspensionProblem,
      SuspensionSymptom,
      SuspensionRule,
      SuspensionSolution,
    ]),
  ],
  controllers: [
    SuspensionProblemsController,
    SuspensionSymptomsController,
    SuspensionRulesController,
    SuspensionSolutionsController,
    ConsultationsController,
  ],
  providers: [
    SuspensionProblemsService,
    SuspensionSymptomsService,
    SuspensionRulesService,
    SuspensionSolutionsService,
    ConsultationsService,
  ],
  exports: [
    SuspensionProblemsService,
    SuspensionSymptomsService,
    SuspensionRulesService,
    SuspensionSolutionsService,
    ConsultationsService,
  ],
})
export class SuspensionModule {}
