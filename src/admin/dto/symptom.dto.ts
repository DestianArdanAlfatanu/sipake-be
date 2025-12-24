import { IsString, IsNotEmpty, IsOptional, Length, Matches } from 'class-validator';

/**
 * DTO for creating a new symptom
 */
export class CreateSymptomDto {
    @IsString()
    @IsNotEmpty()
    @Length(3, 10)
    @Matches(/^G\d{2,3}$/, {
        message: 'Symptom ID must be in format G01, G02, etc.',
    })
    id: string;

    @IsString()
    @IsNotEmpty()
    @Length(5, 255)
    name: string;

    @IsString()
    @IsOptional()
    pict?: string;
}

/**
 * DTO for updating a symptom
 */
export class UpdateSymptomDto {
    @IsString()
    @IsOptional()
    @Length(5, 255)
    name?: string;

    @IsString()
    @IsOptional()
    pict?: string;
}
