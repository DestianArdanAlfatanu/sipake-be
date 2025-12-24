import { IsBoolean, IsString } from 'class-validator';

export class ConsultationProcessStepDto {
    @IsString()
    symptom_id: string;

    @IsBoolean()
    yes: boolean;
}
