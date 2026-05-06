import { IsString, IsNotEmpty, IsOptional, Length, Matches } from 'class-validator';

/**
 * DTO for creating a new suspension symptom
 */
export class CreateSuspensionSymptomDto {
    @IsString()
    @IsNotEmpty()
    @Length(2, 10)
    @Matches(/^(GS)\d{2,3}$/, {
        message: 'Symptom ID must be in format GS01, GS02, etc.',
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
    media?: string;
}

/**
 * DTO for updating a suspension symptom
 */
export class UpdateSuspensionSymptomDto {
    @IsString()
    @IsOptional()
    @Length(3, 255)
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    media?: string;
}
