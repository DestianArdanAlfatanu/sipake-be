import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateRuleDto {
  @IsString()
  @IsNotEmpty()
  problem_id: string;

  @IsString()
  @IsNotEmpty()
  symptom_id: string;

  @IsNumber()
  @Min(0)
  @Max(1)
  cf_pakar: number;
}