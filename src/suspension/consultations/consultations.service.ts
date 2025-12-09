import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SuspensionRule } from '../rules/entities/rules.entity';
import { SuspensionProblem } from '../problems/entities/problems.entity';
import { SuspensionSolution } from '../solutions/entities/solutions.entity';
import { ConsultationProcessDto } from './dto/consultation-process.dto';

@Injectable()
export class ConsultationsService {
  constructor(
    @InjectRepository(SuspensionRule)
    private ruleRepo: Repository<SuspensionRule>,
    @InjectRepository(SuspensionProblem)
    private problemRepo: Repository<SuspensionProblem>,
    @InjectRepository(SuspensionSolution)
    private solutionRepo: Repository<SuspensionSolution>,
  ) {}

  /**
   * Return all symptoms to let frontend build questionnaire
   * (Optionally you can also return partial flow)
   */
  async start() {
    // For simplicity, let frontend call GET /suspension/symptoms for list
    return { message: 'Use GET /suspension/symptoms to fetch available symptoms' };
  }

  /**
   * Main CF calculation
   * dto.symptoms: [{ symptomId, userCf }]
   */
  async process(username: string, dto: ConsultationProcessDto) {
    // 1. load all rules with related problem and symptom
    const rules = await this.ruleRepo.find({
      relations: ['problem', 'symptom'],
    });

    // group rules by problemId
    const grouped: Record<string, SuspensionRule[]> = {};
    for (const r of rules) {
      const pid = r.problem.id;
      if (!grouped[pid]) grouped[pid] = [];
      grouped[pid].push(r);
    }

    const results: {
      problemId: string;
      problemName: string;
      certainty: number;
      solution?: string;
    }[] = [];

    // 2. For each problem, compute CF combine
    for (const pid of Object.keys(grouped)) {
      let CFold = 0;
      for (const rule of grouped[pid]) {
        const ans = dto.symptoms.find((s) => s.symptomId === rule.symptom.id);
        if (!ans) continue;

        const CF_user = clamp(ans.userCf, 0, 1);
        const CF_expert = clamp(rule.expertCf ?? 0.8, 0, 1);
        const CF_temp = CF_user * CF_expert;

        CFold = CFold + CF_temp * (1 - CFold); // CF combination formula
      }

      // fetch solution text (if available)
      const sol = await this.solutionRepo.findOne({
        where: { problem: { id: pid } },
        relations: ['problem'],
      }).catch(() => null);

      const problem = grouped[pid][0].problem;
      results.push({
        problemId: pid,
        problemName: problem.name,
        certainty: CFold,
        solution: sol?.solution ?? problem?.solution?.solution ?? undefined,
      });
    }

    // 3. sort desc
    results.sort((a, b) => b.certainty - a.certainty);

    const best = results.length ? results[0] : null;

    return {
      best,
      ranking: results,
    };
  }
}

function clamp(v: number, a = 0, b = 1) {
  if (typeof v !== 'number' || Number.isNaN(v)) return a;
  if (v < a) return a;
  if (v > b) return b;
  return v;
}
