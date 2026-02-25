import { IsString, IsNotEmpty, IsOptional, Length, Matches } from 'class-validator';

/**
 * DTO for creating a new problem
 */
export class CreateProblemDto {
    @IsString()
    @IsNotEmpty()
    @Length(2, 10)
    @Matches(/^(PE)\d{2,3}$/, {
        message: 'Problem ID must be in format PE01, PE02, etc.',
    })
    id: string;

    @IsString()
    @IsNotEmpty()
    @Length(3, 255)
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    pict?: string;

    @IsString()
    @IsOptional()
    solution?: string;
}

/**
 * DTO for updating a problem
 */
export class UpdateProblemDto {
    @IsString()
    @IsOptional()
    @Length(3, 255)
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    pict?: string;
}
