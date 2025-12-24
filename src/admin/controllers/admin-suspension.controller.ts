import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';

import { SuspensionProblemsService } from '../../suspension/problems/problems.service';
import { SuspensionSymptomsService } from '../../suspension/symptoms/symptoms.service';
import { SuspensionRulesService } from '../../suspension/rules/rules.service';

import { CreateProblemDto, UpdateProblemDto } from '../dto/problem.dto';
import { CreateSymptomDto, UpdateSymptomDto } from '../dto/symptom.dto';
import { CreateRuleDto } from '../../suspension/rules/dto/create-rule.dto';
import { UpdateRuleDto } from '../../suspension/rules/dto/update-rule.dto';

/**
 * Admin Suspension Controller
 * 
 * Handles CRUD operations for Suspension module:
 * - Problems management
 * - Symptoms management
 * - Rules/CF management
 * 
 * Access: EXPERT and SUPER_ADMIN only
 */
@Controller('admin/suspension')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.EXPERT, UserRole.SUPER_ADMIN)
export class AdminSuspensionController {
    constructor(
        private readonly problemsService: SuspensionProblemsService,
        private readonly symptomsService: SuspensionSymptomsService,
        private readonly rulesService: SuspensionRulesService,
    ) { }

    // ==================== PROBLEMS CRUD ====================

    @Get('problems')
    async getAllProblems(
        @Query('search') search?: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        const problems = await this.problemsService.findAll();

        let filtered = problems;
        if (search) {
            filtered = problems.filter(
                (p) =>
                    p.name.toLowerCase().includes(search.toLowerCase()) ||
                    p.id.toLowerCase().includes(search.toLowerCase()),
            );
        }

        const start = (page - 1) * limit;
        const paginated = filtered.slice(start, start + limit);

        return {
            data: paginated,
            meta: {
                total: filtered.length,
                page,
                limit,
                totalPages: Math.ceil(filtered.length / limit),
            },
        };
    }

    @Get('problems/:id')
    async getProblem(@Param('id') id: string) {
        const problem = await this.problemsService.findOne(id);
        if (!problem) {
            throw new HttpException('Problem not found', HttpStatus.NOT_FOUND);
        }
        return { data: problem };
    }

    @Post('problems')
    async createProblem(@Body() dto: CreateProblemDto) {
        const existing = await this.problemsService.findOne(dto.id);
        if (existing) {
            throw new HttpException('Problem ID already exists', HttpStatus.CONFLICT);
        }

        const problem = await this.problemsService.create(dto);
        return {
            message: 'Problem created successfully',
            data: problem,
        };
    }

    @Put('problems/:id')
    async updateProblem(@Param('id') id: string, @Body() dto: UpdateProblemDto) {
        const problem = await this.problemsService.findOne(id);
        if (!problem) {
            throw new HttpException('Problem not found', HttpStatus.NOT_FOUND);
        }

        const updated = await this.problemsService.update(id, dto);
        return {
            message: 'Problem updated successfully',
            data: updated,
        };
    }

    @Delete('problems/:id')
    async deleteProblem(@Param('id') id: string) {
        const problem = await this.problemsService.findOne(id);
        if (!problem) {
            throw new HttpException('Problem not found', HttpStatus.NOT_FOUND);
        }

        await this.problemsService.remove(id);
        return { message: 'Problem deleted successfully' };
    }

    // ==================== SYMPTOMS CRUD ====================

    @Get('symptoms')
    async getAllSymptoms(
        @Query('search') search?: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        const symptoms = await this.symptomsService.findAll();

        let filtered = symptoms;
        if (search) {
            filtered = symptoms.filter(
                (s) =>
                    s.name.toLowerCase().includes(search.toLowerCase()) ||
                    s.id.toLowerCase().includes(search.toLowerCase()),
            );
        }

        const start = (page - 1) * limit;
        const paginated = filtered.slice(start, start + limit);

        return {
            data: paginated,
            meta: {
                total: filtered.length,
                page,
                limit,
                totalPages: Math.ceil(filtered.length / limit),
            },
        };
    }

    @Get('symptoms/:id')
    async getSymptom(@Param('id') id: string) {
        const symptom = await this.symptomsService.findOne(id);
        if (!symptom) {
            throw new HttpException('Symptom not found', HttpStatus.NOT_FOUND);
        }
        return { data: symptom };
    }

    @Post('symptoms')
    async createSymptom(@Body() dto: CreateSymptomDto) {
        const existing = await this.symptomsService.findOne(dto.id);
        if (existing) {
            throw new HttpException('Symptom ID already exists', HttpStatus.CONFLICT);
        }

        const symptom = await this.symptomsService.create(dto);
        return {
            message: 'Symptom created successfully',
            data: symptom,
        };
    }

    @Put('symptoms/:id')
    async updateSymptom(@Param('id') id: string, @Body() dto: UpdateSymptomDto) {
        const symptom = await this.symptomsService.findOne(id);
        if (!symptom) {
            throw new HttpException('Symptom not found', HttpStatus.NOT_FOUND);
        }

        const updated = await this.symptomsService.update(id, dto);
        return {
            message: 'Symptom updated successfully',
            data: updated,
        };
    }

    @Delete('symptoms/:id')
    async deleteSymptom(@Param('id') id: string) {
        const symptom = await this.symptomsService.findOne(id);
        if (!symptom) {
            throw new HttpException('Symptom not found', HttpStatus.NOT_FOUND);
        }

        await this.symptomsService.remove(id);
        return { message: 'Symptom deleted successfully' };
    }

    // ==================== RULES CRUD ====================

    @Get('rules')
    async getAllRules() {
        const rules = await this.rulesService.findAll();
        return { data: rules };
    }

    @Get('rules/problem/:problemId')
    async getRulesByProblem(@Param('problemId') problemId: string) {
        const rules = await this.rulesService.findByProblem(problemId);
        return { data: rules };
    }

    @Post('rules')
    async createRule(@Body() dto: CreateRuleDto) {
        if (dto.expertCf < 0 || dto.expertCf > 1) {
            throw new HttpException(
                'CF value must be between 0.0 and 1.0',
                HttpStatus.BAD_REQUEST,
            );
        }

        const rule = await this.rulesService.create(dto);
        return {
            message: 'Rule created successfully',
            data: rule,
        };
    }

    @Put('rules/:id')
    async updateRule(@Param('id') id: number, @Body() dto: UpdateRuleDto) {
        if (dto.expertCf && (dto.expertCf < 0 || dto.expertCf > 1)) {
            throw new HttpException(
                'CF value must be between 0.0 and 1.0',
                HttpStatus.BAD_REQUEST,
            );
        }

        const rule = await this.rulesService.findOne(id);
        if (!rule) {
            throw new HttpException('Rule not found', HttpStatus.NOT_FOUND);
        }

        const updated = await this.rulesService.update(id, dto);
        return {
            message: 'Rule updated successfully',
            data: updated,
        };
    }

    @Delete('rules/:id')
    async deleteRule(@Param('id') id: number) {
        const rule = await this.rulesService.findOne(id);
        if (!rule) {
            throw new HttpException('Rule not found', HttpStatus.NOT_FOUND);
        }

        await this.rulesService.remove(id);
        return { message: 'Rule deleted successfully' };
    }
}
