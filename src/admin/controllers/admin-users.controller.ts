import {
    Controller,
    Get,
    Post,
    Delete,
    Patch,
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
import { UsersService } from '../../users/users.service';
import { CreateExpertDto, UpdateUserRoleDto } from '../dto/user.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';

/**
 * Admin Users Controller
 * 
 * Handles user management operations:
 * - View all users
 * - Create expert accounts
 * - Update user roles
 * - Delete/ban users
 * 
 * Access: SUPER_ADMIN only
 */
@Controller('admin/users')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
export class AdminUsersController {
    constructor(
        private readonly usersService: UsersService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    @Get()
    async getAllUsers(
        @Query('search') search?: string,
        @Query('role') role?: UserRole,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        try {
            let query = this.userRepository.createQueryBuilder('user');

            // Filter by role if provided
            if (role) {
                query = query.where('user.role = :role', { role });
            }

            // Search by username, name, or email
            if (search) {
                query = query.andWhere(
                    '(user.username LIKE :search OR user.name LIKE :search OR user.email LIKE :search)',
                    { search: `%${search}%` },
                );
            }

            // Pagination
            const skip = (page - 1) * limit;
            query = query.skip(skip).take(limit);

            // Order by created_at
            query = query.orderBy('user.created_at', 'DESC');

            const [users, total] = await query.getManyAndCount();

            // Remove sensitive data
            const sanitized = users.map(({ password, ...user }) => user);

            return {
                data: sanitized,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            throw new HttpException(
                'Failed to fetch users',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get(':username')
    async getUser(@Param('username') username: string) {
        try {
            const user = await this.usersService.getProfile(username);
            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }

            // Remove sensitive data
            const { password, ...sanitized } = user;
            return { data: sanitized };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                'Failed to fetch user',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Post('expert')
    async createExpert(@Body() dto: CreateExpertDto) {
        try {
            // Check if username already exists
            const existing = await this.userRepository.findOne({
                where: { username: dto.username },
            });
            if (existing) {
                throw new HttpException('Username already exists', HttpStatus.CONFLICT);
            }

            // Check if email already exists
            const existingEmail = await this.userRepository.findOne({
                where: { email: dto.email },
            });
            if (existingEmail) {
                throw new HttpException('Email already exists', HttpStatus.CONFLICT);
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(dto.password, 10);

            // Create expert account
            const expert = await this.userRepository.save({
                ...dto,
                password: hashedPassword,
                role: UserRole.EXPERT,
                verified: true, // Auto-verify expert accounts
                profilePicture: 'default-expert.jpg',
                plateNumber: 'N/A',
            });

            // Remove sensitive data
            const { password, ...sanitized } = expert;

            return {
                message: 'Expert account created successfully',
                data: sanitized,
            };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                'Failed to create expert account',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Patch(':username/role')
    async updateUserRole(
        @Param('username') username: string,
        @Body() dto: UpdateUserRoleDto,
    ) {
        try {
            const user = await this.userRepository.findOne({
                where: { username },
            });
            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }

            // Prevent changing own role
            // (You'd need to get current user from request to implement this)

            user.role = dto.role;
            await this.userRepository.save(user);

            const { password, ...sanitized } = user;

            return {
                message: 'User role updated successfully',
                data: sanitized,
            };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                'Failed to update user role',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Delete(':username')
    async deleteUser(@Param('username') username: string) {
        try {
            const user = await this.userRepository.findOne({
                where: { username },
            });
            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }

            // Prevent deleting super admin
            if (user.role === UserRole.SUPER_ADMIN) {
                throw new HttpException(
                    'Cannot delete super admin account',
                    HttpStatus.FORBIDDEN,
                );
            }

            await this.userRepository.remove(user);

            return {
                message: 'User deleted successfully',
            };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                'Failed to delete user',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get('stats/summary')
    async getUserStats() {
        try {
            const total = await this.userRepository.count();
            const admins = await this.userRepository.count({
                where: { role: UserRole.SUPER_ADMIN },
            });
            const experts = await this.userRepository.count({
                where: { role: UserRole.EXPERT },
            });
            const users = await this.userRepository.count({
                where: { role: UserRole.USER },
            });
            const verified = await this.userRepository.count({
                where: { verified: true },
            });

            return {
                data: {
                    total,
                    admins,
                    experts,
                    users,
                    verified,
                    unverified: total - verified,
                },
            };
        } catch (error) {
            throw new HttpException(
                'Failed to fetch user statistics',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
