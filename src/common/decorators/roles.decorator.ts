import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/entities/user.entity';

/**
 * Roles decorator for RBAC (Role-Based Access Control)
 * 
 * Usage:
 * @Roles(UserRole.SUPER_ADMIN)
 * @Roles(UserRole.EXPERT, UserRole.SUPER_ADMIN)
 * 
 * This decorator sets metadata that will be read by RolesGuard
 */
export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
