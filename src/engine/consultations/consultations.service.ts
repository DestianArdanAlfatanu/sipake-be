import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Rule } from '../rules/entities/rule.entity';
import { ConsultationProcessDto } from './dto/consultation-process.dto';

@Injectable()
export class ConsultationsService {
  constructor(
    @InjectRepository(Rule)
    private rulesRepository: Repository<Rule>,
  ) {}

  // Endpoint Start hanya formalitas di CF
  async start() {
    return {
      message: 'Silakan ambil data gejala dari endpoint GET /engine/symptoms',
      status: 'Ready',
    };
  }

  // Logika Utama Certainty Factor
  async process(username: string, dto: ConsultationProcessDto) {
    // 1. Ambil ID gejala yang dipilih user
    const symptomIds = dto.symptoms.map((s) => s.symptomId);

    if (symptomIds.length === 0) {
      return { best: null, ranking: [] };
    }

    // 2. Ambil Rules yang relevan + Join Masalah & Solusi
    const rules = await this.rulesRepository.find({
      where: {
        symptom: { id: In(symptomIds) },
      },
      relations: ['problem', 'symptom', 'problem.solution'],
    });

    // 3. Grouping Rules berdasarkan Masalah
    const grouped: Record<string, Rule[]> = {};
    for (const r of rules) {
      const pid = r.problem.id;
      if (!grouped[pid]) grouped[pid] = [];
      grouped[pid].push(r);
    }

    const results: any[] = [];

    // 4. Hitung CF Combine untuk setiap masalah
    for (const pid of Object.keys(grouped)) {
      let CFold = 0;
      const rulesForProblem = grouped[pid];
      const problem = rulesForProblem[0].problem;
      
      // Ambil solusi (safe navigation)
      // Sesuaikan nama field 'solution' atau 'solusi' dengan entity Solution Anda
      const solutionText = problem.solution ? (problem.solution as any).solution : 'Solusi belum tersedia';

      for (const rule of rulesForProblem) {
        const userInput = dto.symptoms.find((s) => s.symptomId === rule.symptom.id);
        if (!userInput) continue;

        const CF_user = this.clamp(userInput.userCf, 0, 1);
        const CF_expert = this.clamp(rule.cfPakar, 0, 1);
        
        // CF Sequential: CF(H,E) = CF(E) * CF(Rule)
        const CF_current = CF_user * CF_expert;

        // CF Combination: CF_new = CF_old + CF_current * (1 - CF_old)
        CFold = CFold + CF_current * (1 - CFold);
      }

      results.push({
        problemId: pid,
        problemName: problem.name,
        certainty: CFold,
        formattedCertainty: (CFold * 100).toFixed(2) + '%',
        solution: solutionText,
      });
    }

    // 5. Urutkan dari nilai tertinggi
    results.sort((a, b) => b.certainty - a.certainty);
    const best = results.length > 0 && results[0].certainty > 0 ? results[0] : null;

    return {
      user: username,
      total_problems_analyzed: results.length,
      best_match: best,
      all_possibilities: results,
    };
  }

  private clamp(v: number, min = 0, max = 1) {
    if (typeof v !== 'number' || Number.isNaN(v)) return min;
    return Math.min(Math.max(v, min), max);
  }
}