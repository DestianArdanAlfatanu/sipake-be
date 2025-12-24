import {
    Controller,
    Get,
    Query,
    UseGuards,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ConsultationHistory } from '../../engine/consultations/entities/consultation_history.entity';

/**
 * Admin Stats Controller
 * 
 * Provides statistics and analytics for the dashboard:
 * - Total users, consultations
 * - Top problems and symptoms
 * - Consultation history
 * - Trends and insights
 * 
 * Access: EXPERT and SUPER_ADMIN
 */
@Controller('admin/stats')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.EXPERT, UserRole.SUPER_ADMIN)
export class AdminStatsController {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(ConsultationHistory)
        private readonly historyRepository: Repository<ConsultationHistory>,
    ) { }

    @Get('dashboard')
    async getDashboardStats() {
        try {
            // Total users
            const totalUsers = await this.userRepository.count();

            // Total consultations
            const totalConsultations = await this.historyRepository.count();

            // Consultations today
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const consultationsToday = await this.historyRepository
                .createQueryBuilder('history')
                .where('history.consultation_date >= :today', { today })
                .getCount();

            // Consultations this week
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            const consultationsThisWeek = await this.historyRepository
                .createQueryBuilder('history')
                .where('history.consultation_date >= :weekAgo', { weekAgo })
                .getCount();

            // Consultations this month
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            const consultationsThisMonth = await this.historyRepository
                .createQueryBuilder('history')
                .where('history.consultation_date >= :monthAgo', { monthAgo })
                .getCount();

            // Top problems (most diagnosed)
            const topProblems = await this.historyRepository
                .createQueryBuilder('history')
                .select('history.problem_id', 'problemId')
                .addSelect('COUNT(*)', 'count')
                .groupBy('history.problem_id')
                .orderBy('count', 'DESC')
                .limit(5)
                .getRawMany();

            // Module distribution
            const engineCount = await this.historyRepository.count({
                where: { module: 'engine' },
            });
            const suspensionCount = await this.historyRepository.count({
                where: { module: 'suspension' },
            });

            return {
                data: {
                    users: {
                        total: totalUsers,
                    },
                    consultations: {
                        total: totalConsultations,
                        today: consultationsToday,
                        thisWeek: consultationsThisWeek,
                        thisMonth: consultationsThisMonth,
                        byModule: {
                            engine: engineCount,
                            suspension: suspensionCount,
                        },
                    },
                    topProblems: topProblems.map((p) => ({
                        problemId: p.problemId,
                        count: parseInt(p.count),
                    })),
                },
            };
        } catch (error) {
            throw new HttpException(
                'Failed to fetch dashboard statistics',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get('consultations')
    async getConsultationHistory(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('module') module?: string,
    ) {
        try {
            let query = this.historyRepository
                .createQueryBuilder('history')
                .leftJoinAndSelect('history.user', 'user')
                .orderBy('history.consultation_date', 'DESC');

            // Filter by module if provided
            if (module) {
                query = query.where('history.module = :module', { module });
            }

            // Pagination
            const skip = (page - 1) * limit;
            query = query.skip(skip).take(limit);

            const [histories, total] = await query.getManyAndCount();

            return {
                data: histories,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            throw new HttpException(
                'Failed to fetch consultation history',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get('trends')
    async getTrends(@Query('days') days: number = 30) {
        try {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);

            // Get consultations per day
            const consultationsPerDay = await this.historyRepository
                .createQueryBuilder('history')
                .select('DATE(history.consultation_date)', 'date')
                .addSelect('COUNT(*)', 'count')
                .where('history.consultation_date >= :startDate', { startDate })
                .groupBy('DATE(history.consultation_date)')
                .orderBy('date', 'ASC')
                .getRawMany();

            // Get new users per day
            const newUsersPerDay = await this.userRepository
                .createQueryBuilder('user')
                .select('DATE(user.created_at)', 'date')
                .addSelect('COUNT(*)', 'count')
                .where('user.created_at >= :startDate', { startDate })
                .groupBy('DATE(user.created_at)')
                .orderBy('date', 'ASC')
                .getRawMany();

            return {
                data: {
                    consultationsPerDay: consultationsPerDay.map((d) => ({
                        date: d.date,
                        count: parseInt(d.count),
                    })),
                    newUsersPerDay: newUsersPerDay.map((d) => ({
                        date: d.date,
                        count: parseInt(d.count),
                    })),
                },
            };
        } catch (error) {
            throw new HttpException(
                'Failed to fetch trends',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get('module-comparison')
    async getModuleComparison() {
        try {
            // Get stats for both modules
            const engineStats = await this.historyRepository
                .createQueryBuilder('history')
                .select('history.problem_id', 'problemId')
                .addSelect('COUNT(*)', 'count')
                .where('history.module = :module', { module: 'engine' })
                .groupBy('history.problem_id')
                .orderBy('count', 'DESC')
                .limit(5)
                .getRawMany();

            const suspensionStats = await this.historyRepository
                .createQueryBuilder('history')
                .select('history.problem_id', 'problemId')
                .addSelect('COUNT(*)', 'count')
                .where('history.module = :module', { module: 'suspension' })
                .groupBy('history.problem_id')
                .orderBy('count', 'DESC')
                .limit(5)
                .getRawMany();

            return {
                data: {
                    engine: {
                        topProblems: engineStats.map((p) => ({
                            problemId: p.problemId,
                            count: parseInt(p.count),
                        })),
                    },
                    suspension: {
                        topProblems: suspensionStats.map((p) => ({
                            problemId: p.problemId,
                            count: parseInt(p.count),
                        })),
                    },
                },
            };
        } catch (error) {
            throw new HttpException(
                'Failed to fetch module comparison',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
