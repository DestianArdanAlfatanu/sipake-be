import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SuspensionProblem } from './problems/entities/problems.entity';
import { SuspensionSymptom } from './symptoms/entities/suspension-symptom.entity';
import { SuspensionRule } from './rules/entities/suspension-rule.entity';
import { SuspensionSolution } from './solutions/entities/suspension-solution.entity';

import { SuspensionProblemsService } from './problems/suspension-problems.service';
import { SuspensionProblemsController } from './problems/suspension-problems.controller';

import { SuspensionSymptomsService } from './symptoms/suspension-symptoms.service';
import { SuspensionSymptomsController } from './symptoms/suspension-symptoms.controller';

import { SuspensionRulesService } from './rules/suspension-rules.service';
import { SuspensionRulesController } from './rules/suspension-rules.controller';

import { SuspensionSolutionsService } from './solutions/suspension-solutions.service';
import { SuspensionSolutionsController } from './solutions/suspension-solutions.controller';

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
