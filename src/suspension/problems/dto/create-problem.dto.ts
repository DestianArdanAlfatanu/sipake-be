export class CreateProblemDto {
  id: string;
  name: string;
  description?: string;
  pict?: string;
  solutionId?: string; // optional relation
}
