export class ConsultationSymptomAnswer {
  symptomId: string;
  userCf: number; // 0.0 - 1.0
}

export class ConsultationProcessDto {
  // array of answers collected from frontend (or full list)
  symptoms: ConsultationSymptomAnswer[];
}
