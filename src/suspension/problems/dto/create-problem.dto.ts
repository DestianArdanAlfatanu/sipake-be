import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProblemDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  pict?: string;

  @IsString()
  @IsOptional()
  solutionId?: string; // optional relation

  @IsString()
  @IsOptional()
  solution?: string; // solution text
}
