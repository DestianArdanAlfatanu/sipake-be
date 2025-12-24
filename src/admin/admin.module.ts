import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEngineController } from './controllers/admin-engine.controller';
import { AdminSuspensionController } from './controllers/admin-suspension.controller';
import { AdminUsersController } from './controllers/admin-users.controller';
import { AdminStatsController } from './controllers/admin-stats.controller';

// Engine entities
import { Problem } from '../engine/problems/entities/problem.entity';
import { Symptom } from '../engine/symptoms/entities/symptom.entity';
import { Rule } from '../engine/rules/entities/rule.entity';
import { Solution } from '../engine/solutions/entities/solution.entity';

// Suspension entities
import { SuspensionProblem } from '../suspension/problems/entities/problems.entity';
import { SuspensionSymptom } from '../suspension/symptoms/entities/symptoms.entity';
import { SuspensionRule } from '../suspension/rules/entities/rules.entity';
import { SuspensionSolution } from '../suspension/solutions/entities/solutions.entity';

// User entities
import { User } from '../users/entities/user.entity';
import { ConsultationHistory } from '../engine/consultations/entities/consultation_history.entity';

// Services
import { ProblemsService } from '../engine/problems/problems.service';
import { SymptomsService } from '../engine/symptoms/symptoms.service';
import { RulesService } from '../engine/rules/rules.service';
import { SolutionsService } from '../engine/solutions/solutions.service';

import { SuspensionProblemsService } from '../suspension/problems/problems.service';
import { SuspensionSymptomsService } from '../suspension/symptoms/symptoms.service';
import { SuspensionRulesService } from '../suspension/rules/rules.service';
import { SuspensionSolutionsService } from '../suspension/solutions/solutions.service';

import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { VerificationCode } from '../users/entities/verification.entity';

/**
 * Admin Module
 * 
 * Handles all admin-related functionality:
 * - Engine management (Problems, Symptoms, Rules)
 * - Suspension management (Problems, Symptoms, Rules)
 * - User management (SUPER_ADMIN only)
 * - Statistics and analytics
 */
@Module({
    imports: [
        TypeOrmModule.forFeature([
            // Engine
            Problem,
            Symptom,
            Rule,
            Solution,
            // Suspension
            SuspensionProblem,
            SuspensionSymptom,
            SuspensionRule,
            SuspensionSolution,
            // Users & History
            User,
            VerificationCode,
            ConsultationHistory,
        ]),
    ],
    controllers: [
        AdminEngineController,
        AdminSuspensionController,
        AdminUsersController,
        AdminStatsController,
    ],
    providers: [
        // Engine services
        ProblemsService,
        SymptomsService,
        RulesService,
        SolutionsService,
        // Suspension services
        SuspensionProblemsService,
        SuspensionSymptomsService,
        SuspensionRulesService,
        SuspensionSolutionsService,
        // User services
        UsersService,
        JwtService,
        // MailerService is globally available from AppModule
    ],
})
export class AdminModule { }
