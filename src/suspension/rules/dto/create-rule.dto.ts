export class CreateRuleDto {
  problemId: string;   // references SuspensionProblem.id
  symptomId: string;   // references SuspensionSymptom.id
  expertCf?: number;   // optional, 0.0 - 1.0
}
