import { IsString, IsNotEmpty, IsNumber, Min, Max, IsOptional } from 'class-validator';

/**
 * DTO for creating a new rule
 */
export class CreateRuleDto {
    @IsString()
    @IsNotEmpty()
    problemId: string;

    @IsString()
    @IsNotEmpty()
    symptomId: string;

    @IsNumber()
    @Min(0, { message: 'CF value must be at least 0' })
    @Max(1, { message: 'CF value must be at most 1' })
    cfPakar: number;
}

/**
 * DTO for updating a rule
 */
export class UpdateRuleDto {
    @IsNumber()
    @IsOptional()
    @Min(0, { message: 'CF value must be at least 0' })
    @Max(1, { message: 'CF value must be at most 1' })
    cfPakar?: number;
}

/**
 * DTO for bulk updating rules for a problem
 */
export class BulkUpdateRulesDto {
    @IsString()
    @IsNotEmpty()
    problemId: string;

    rules: Array<{
        symptomId: string;
        cfPakar: number;
    }>;
}
