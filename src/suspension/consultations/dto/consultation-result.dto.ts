export class ConsultationResultItem {
  problemId: string;
  problemName: string;
  certainty: number; // 0.0 - 1.0
  solution?: string;
}

export class ConsultationResultDto {
  best: ConsultationResultItem | null;
  ranking: ConsultationResultItem[];
}
