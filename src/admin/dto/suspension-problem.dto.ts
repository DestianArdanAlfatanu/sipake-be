import { IsString, IsNotEmpty, IsOptional, Length, Matches } from 'class-validator';

/**
 * DTO for creating a new suspension problem
 */
export class CreateSuspensionProblemDto {
    @IsString()
    @IsNotEmpty()
    @Length(2, 10)
    @Matches(/^(PS)\d{2,3}$/, {
        message: 'Problem ID must be in format PS01, PS02, etc.',
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
 * DTO for updating a suspension problem
 */
export class UpdateSuspensionProblemDto {
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
