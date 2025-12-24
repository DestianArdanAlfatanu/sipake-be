import { IsString, IsNotEmpty, IsOptional, Length, Matches } from 'class-validator';

/**
 * DTO for creating a new problem
 */
export class CreateProblemDto {
    @IsString()
    @IsNotEmpty()
    @Length(3, 10)
    @Matches(/^P\d{2,3}$/, {
        message: 'Problem ID must be in format P01, P02, etc.',
    })
    id: string;

    @IsString()
    @IsNotEmpty()
    @Length(5, 255)
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    pict?: string;
}

/**
 * DTO for updating a problem
 */
export class UpdateProblemDto {
    @IsString()
    @IsOptional()
    @Length(5, 255)
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    pict?: string;
}
