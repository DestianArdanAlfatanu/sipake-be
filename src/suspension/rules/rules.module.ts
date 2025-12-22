import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuspensionRulesController } from './rules.controller';
import { SuspensionRulesService } from './rules.service';
import { SuspensionRule } from './entities/rules.entity';
import { SuspensionProblem } from '../problems/entities/problems.entity';
import { SuspensionSymptom } from '../symptoms/entities/symptoms.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            SuspensionRule,
            SuspensionProblem,
            SuspensionSymptom,
        ]),
    ],
    controllers: [SuspensionRulesController],
    providers: [SuspensionRulesService],
    exports: [SuspensionRulesService],
})
export class RulesModule { }
