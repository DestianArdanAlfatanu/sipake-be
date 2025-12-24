import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/entities/user.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * RolesGuard - Authorization guard for RBAC
 * 
 * This guard checks if the authenticated user has one of the required roles
 * specified by the @Roles() decorator.
 * 
 * Usage:
 * @UseGuards(AuthGuard, RolesGuard)
 * @Roles(UserRole.SUPER_ADMIN)
 * async someMethod() { ... }
 */
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        // Get required roles from @Roles() decorator
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        // If no roles are required, allow access
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        // Get user from request (set by AuthGuard)
        const { user } = context.switchToHttp().getRequest();

        // If no user, deny access
        if (!user) {
            throw new ForbiddenException('User not authenticated');
        }

        // Check if user has one of the required roles
        const hasRole = requiredRoles.some((role) => user.role === role);

        if (!hasRole) {
            throw new ForbiddenException(
                `Access denied. Required roles: ${requiredRoles.join(', ')}. Your role: ${user.role}`,
            );
        }

        return true;
    }
}
