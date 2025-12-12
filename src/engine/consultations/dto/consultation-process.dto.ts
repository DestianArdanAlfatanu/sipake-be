import { IsArray, IsNumber, IsString, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SymptomInput {
  @IsString()
  symptomId: string;

  @IsNumber()
  @Min(0)
  @Max(1)
  userCf: number;
}

export class ConsultationProcessDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SymptomInput)
  symptoms: SymptomInput[];
}