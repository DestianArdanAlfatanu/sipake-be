import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRuleDto {
  @IsNotEmpty({ message: 'problem_id wajib diisi' })
  @IsString()
  problem_id: string;

  @IsNotEmpty({ message: 'symptom_id wajib diisi' })
  @IsString()
  symptom_id: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'cf_pakar harus berupa angka' })
  @Min(0, { message: 'cf_pakar minimal 0' })
  @Max(1, { message: 'cf_pakar maksimal 1' })
  cf_pakar?: number;
}