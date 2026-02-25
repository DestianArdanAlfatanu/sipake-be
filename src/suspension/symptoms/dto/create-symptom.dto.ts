import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSymptomDto {
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
  media?: string;
}
