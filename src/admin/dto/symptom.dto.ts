import { IsString, IsNotEmpty, IsOptional, Length, Matches } from 'class-validator';

/**
 * DTO for creating a new symptom
 */
export class CreateSymptomDto {
    @IsString()
    @IsNotEmpty()
    @Length(2, 10)
    @Matches(/^(GE)\d{2,3}$/, {
        message: 'Symptom ID must be in format GE01, GE02, etc.',
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
 * DTO for updating a symptom
 */
export class UpdateSymptomDto {
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
