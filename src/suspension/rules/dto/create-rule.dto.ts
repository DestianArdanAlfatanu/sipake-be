import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRuleDto {
  @IsNotEmpty({ message: 'problemId wajib diisi' })
  @IsString()
  problemId: string;   // references SuspensionProblem.id

  @IsNotEmpty({ message: 'symptomId wajib diisi' })
  @IsString()
  symptomId: string;   // references SuspensionSymptom.id

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'expertCf harus berupa angka' })
  @Min(0, { message: 'expertCf minimal 0' })
  @Max(1, { message: 'expertCf maksimal 1' })
  expertCf?: number;   // optional, 0.0 - 1.0
}
