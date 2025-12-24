import { IsString, IsNotEmpty, IsEmail, IsOptional, Length, IsEnum } from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';

/**
 * DTO for creating a new expert account
 */
export class CreateExpertDto {
    @IsString()
    @IsNotEmpty()
    @Length(3, 50)
    username: string;

    @IsString()
    @IsNotEmpty()
    @Length(8, 50)
    password: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    phoneNumber?: string;

    @IsString()
    @IsOptional()
    address?: string;
}

/**
 * DTO for updating user role
 */
export class UpdateUserRoleDto {
    @IsEnum(UserRole)
    @IsNotEmpty()
    role: UserRole;
}

/**
 * DTO for banning/unbanning user
 */
export class BanUserDto {
    @IsString()
    @IsNotEmpty()
    reason?: string;
}

/**
 * DTO for creating any user (USER/EXPERT/SUPER_ADMIN)
 */
export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @Length(3, 50)
    username: string;

    @IsString()
    @IsNotEmpty()
    @Length(8, 50)
    password: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEnum(UserRole)
    @IsNotEmpty()
    role: UserRole;

    @IsString()
    @IsOptional()
    phoneNumber?: string;

    @IsString()
    @IsOptional()
    address?: string;
}

/**
 * DTO for updating user profile
 */
export class UpdateUserDto {
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;

    @IsString()
    @IsOptional()
    phoneNumber?: string;

    @IsString()
    @IsOptional()
    address?: string;
}

