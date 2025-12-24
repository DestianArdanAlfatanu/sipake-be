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

import { ProblemsService } from '../../engine/problems/problems.service';
import { SymptomsService } from '../../engine/symptoms/symptoms.service';
import { RulesService } from '../../engine/rules/rules.service';

import { CreateProblemDto, UpdateProblemDto } from '../dto/problem.dto';
import { CreateSymptomDto, UpdateSymptomDto } from '../dto/symptom.dto';
import { CreateRuleDto } from '../../engine/rules/dto/create-rule.dto';
import { UpdateRuleDto } from '../../engine/rules/dto/update-rule.dto';

/**
 * Admin Engine Controller
 * 
 * Handles CRUD operations for Engine module:
 * - Problems management
 * - Symptoms management
 * - Rules/CF management
 * 
 * Access: EXPERT and SUPER_ADMIN only
 */
@Controller('admin/engine')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.EXPERT, UserRole.SUPER_ADMIN)
export class AdminEngineController {
    constructor(
        private readonly problemsService: ProblemsService,
        private readonly symptomsService: SymptomsService,
        private readonly rulesService: RulesService,
    ) { }

    // ==================== PROBLEMS CRUD ====================

    @Get('problems')
    async getAllProblems(
        @Query('search') search?: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        try {
            const problems = await this.problemsService.findAll();

            // Filter by search if provided
            let filtered = problems;
            if (search) {
                filtered = problems.filter(
                    (p) =>
                        p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.id.toLowerCase().includes(search.toLowerCase()),
                );
            }

            // Pagination
            const start = (page - 1) * limit;
            const end = start + limit;
            const paginated = filtered.slice(start, end);

            return {
                data: paginated,
                meta: {
                    total: filtered.length,
                    page,
                    limit,
                    totalPages: Math.ceil(filtered.length / limit),
                },
            };
        } catch (error) {
            throw new HttpException(
                'Failed to fetch problems',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get('problems/:id')
    async getProblem(@Param('id') id: string) {
        try {
            const problem = await this.problemsService.findOne(id);
            if (!problem) {
                throw new HttpException('Problem not found', HttpStatus.NOT_FOUND);
            }
            return { data: problem };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                'Failed to fetch problem',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Post('problems')
    async createProblem(@Body() dto: CreateProblemDto) {
        try {
            // Check if problem ID already exists
            const existing = await this.problemsService.findOne(dto.id);
            if (existing) {
                throw new HttpException(
                    'Problem ID already exists',
                    HttpStatus.CONFLICT,
                );
            }

            const problem = await this.problemsService.create(dto);
            return {
                message: 'Problem created successfully',
                data: problem,
            };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                'Failed to create problem',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Put('problems/:id')
    async updateProblem(
        @Param('id') id: string,
        @Body() dto: UpdateProblemDto,
    ) {
        try {
            const problem = await this.problemsService.findOne(id);
            if (!problem) {
                throw new HttpException('Problem not found', HttpStatus.NOT_FOUND);
            }

            const updated = await this.problemsService.update(id, dto);
            return {
                message: 'Problem updated successfully',
                data: updated,
            };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                'Failed to update problem',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Delete('problems/:id')
    async deleteProblem(@Param('id') id: string) {
        try {
            const problem = await this.problemsService.findOne(id);
            if (!problem) {
                throw new HttpException('Problem not found', HttpStatus.NOT_FOUND);
            }

            await this.problemsService.remove(id);
            return {
                message: 'Problem deleted successfully',
            };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                'Failed to delete problem',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // ==================== SYMPTOMS CRUD ====================

    @Get('symptoms')
    async getAllSymptoms(
        @Query('search') search?: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        try {
            const symptoms = await this.symptomsService.findAll();

            // Filter by search if provided
            let filtered = symptoms;
            if (search) {
                filtered = symptoms.filter(
                    (s) =>
                        s.name.toLowerCase().includes(search.toLowerCase()) ||
                        s.id.toLowerCase().includes(search.toLowerCase()),
                );
            }

            // Pagination
            const start = (page - 1) * limit;
            const end = start + limit;
            const paginated = filtered.slice(start, end);

            return {
                data: paginated,
                meta: {
                    total: filtered.length,
                    page,
                    limit,
                    totalPages: Math.ceil(filtered.length / limit),
                },
            };
        } catch (error) {
            throw new HttpException(
                'Failed to fetch symptoms',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get('symptoms/:id')
    async getSymptom(@Param('id') id: string) {
        try {
            const symptom = await this.symptomsService.findOne(id);
            if (!symptom) {
                throw new HttpException('Symptom not found', HttpStatus.NOT_FOUND);
            }
            return { data: symptom };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                'Failed to fetch symptom',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Post('symptoms')
    async createSymptom(@Body() dto: CreateSymptomDto) {
        try {
            // Check if symptom ID already exists
            const existing = await this.symptomsService.findOne(dto.id);
            if (existing) {
                throw new HttpException(
                    'Symptom ID already exists',
                    HttpStatus.CONFLICT,
                );
            }

            const symptom = await this.symptomsService.create(dto);
            return {
                message: 'Symptom created successfully',
                data: symptom,
            };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                'Failed to create symptom',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Put('symptoms/:id')
    async updateSymptom(
        @Param('id') id: string,
        @Body() dto: UpdateSymptomDto,
    ) {
        try {
            const symptom = await this.symptomsService.findOne(id);
            if (!symptom) {
                throw new HttpException('Symptom not found', HttpStatus.NOT_FOUND);
            }

            const updated = await this.symptomsService.update(id, dto);
            return {
                message: 'Symptom updated successfully',
                data: updated,
            };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                'Failed to update symptom',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Delete('symptoms/:id')
    async deleteSymptom(@Param('id') id: string) {
        try {
            const symptom = await this.symptomsService.findOne(id);
            if (!symptom) {
                throw new HttpException('Symptom not found', HttpStatus.NOT_FOUND);
            }

            await this.symptomsService.remove(id);
            return {
                message: 'Symptom deleted successfully',
            };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                'Failed to delete symptom',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // ==================== RULES CRUD ====================

    @Get('rules')
    async getAllRules() {
        try {
            const rules = await this.rulesService.findAll();
            return { data: rules };
        } catch (error) {
            throw new HttpException(
                'Failed to fetch rules',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get('rules/problem/:problemId')
    async getRulesByProblem(@Param('problemId') problemId: string) {
        try {
            const rules = await this.rulesService.findByProblem(problemId);
            return { data: rules };
        } catch (error) {
            throw new HttpException(
                'Failed to fetch rules for problem',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Post('rules')
    async createRule(@Body() dto: CreateRuleDto) {
        try {
            // Validate CF value
            if (dto.cf_pakar < 0 || dto.cf_pakar > 1) {
                throw new HttpException(
                    'CF value must be between 0.0 and 1.0',
                    HttpStatus.BAD_REQUEST,
                );
            }

            // Check if rule already exists
            const existing = await this.rulesService.findByProblemAndSymptom(
                dto.problem_id,
                dto.symptom_id,
            );
            if (existing) {
                throw new HttpException(
                    'Rule already exists for this problem-symptom combination',
                    HttpStatus.CONFLICT,
                );
            }

            const rule = await this.rulesService.create(dto);
            return {
                message: 'Rule created successfully',
                data: rule,
            };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                'Failed to create rule',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Put('rules/:id')
    async updateRule(@Param('id') id: number, @Body() dto: UpdateRuleDto) {
        try {
            // Validate CF value
            if (dto.cf_pakar && (dto.cf_pakar < 0 || dto.cf_pakar > 1)) {
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
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                'Failed to update rule',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Delete('rules/:id')
    async deleteRule(@Param('id') id: number) {
        try {
            const rule = await this.rulesService.findOne(id);
            if (!rule) {
                throw new HttpException('Rule not found', HttpStatus.NOT_FOUND);
            }

            await this.rulesService.remove(id);
            return {
                message: 'Rule deleted successfully',
            };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                'Failed to delete rule',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
