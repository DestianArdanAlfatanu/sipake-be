import { Module } from '@nestjs/common';
import { SuspensionConsultationsService } from './consultations.service';
import { SuspensionConsultationsStepService } from './consultations-step.service';
import { SuspensionConsultationsController } from './consultations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuspensionProblem } from '../problems/entities/problems.entity';
import { SuspensionSymptom } from '../symptoms/entities/symptoms.entity';
import { User } from '../../users/entities/user.entity';
import { SuspensionSolution } from '../solutions/entities/solutions.entity';
import { SuspensionRule } from '../rules/entities/rules.entity';
import { RulesModule } from '../rules/rules.module';
import { ConsultationHistory } from '../../engine/consultations/entities/consultation_history.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            SuspensionProblem,
            SuspensionSymptom,
            SuspensionSolution,
            SuspensionRule,
            ConsultationHistory
        ]),
        RulesModule,
    ],
    controllers: [SuspensionConsultationsController],
    providers: [SuspensionConsultationsService, SuspensionConsultationsStepService],
    exports: [SuspensionConsultationsService, SuspensionConsultationsStepService],
})
export class SuspensionConsultationsModule { }
