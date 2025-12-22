import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { SuspensionRule } from '../rules/entities/rules.entity';
import { ConsultationProcessDto } from './dto/consultation-process.dto';
// IMPORT ENTITY HISTORY & USER (Sesuaikan path import Anda)
import { ConsultationHistory } from '../../engine/consultations/entities/consultation_history.entity';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class SuspensionConsultationsService {
  constructor(
    @InjectRepository(SuspensionRule)
    private rulesRepository: Repository<SuspensionRule>,

    // INJECT REPOSITORY HISTORY & USER
    @InjectRepository(ConsultationHistory)
    private historyRepository: Repository<ConsultationHistory>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async start() {
    return {
      message: 'Silakan ambil data gejala dari endpoint GET /suspension/symptoms',
      status: 'Ready',
    };
  }

  // --- LOGIKA UTAMA CF ---
  async process(username: string, dto: ConsultationProcessDto) {
    const symptomIds = dto.symptoms.map((s) => s.symptomId);

    if (symptomIds.length === 0) {
      return { best: null, ranking: [] };
    }

    const rules = await this.rulesRepository.find({
      where: { symptom: { id: In(symptomIds) } },
      relations: ['problem', 'symptom', 'problem.solution'],
    });

    const grouped: Record<string, SuspensionRule[]> = {};
    for (const r of rules) {
      const pid = r.problem.id;
      if (!grouped[pid]) grouped[pid] = [];
      grouped[pid].push(r);
    }

    const results: any[] = [];

    for (const pid of Object.keys(grouped)) {
      let CFold = 0;
      const rulesForProblem = grouped[pid];
      const problem = rulesForProblem[0].problem;
      const solutionText = problem.solution ? (problem.solution as any).solution : 'Solusi belum tersedia';

      for (const rule of rulesForProblem) {
        const userInput = dto.symptoms.find((s) => s.symptomId === rule.symptom.id);
        if (!userInput) continue;

        const CF_user = this.clamp(userInput.userCf, 0, 1);
        const CF_expert = this.clamp(rule.cfPakar, 0, 1);
        const CF_current = CF_user * CF_expert;
        CFold = CFold + CF_current * (1 - CFold);
      }

      results.push({
        problemId: pid,
        problemName: problem.name,
        certainty: CFold,
        formattedCertainty: (CFold * 100).toFixed(2) + '%',
        solution: solutionText,
        fullProblemData: problem, // Simpan object problem lengkap
      });
    }

    results.sort((a, b) => b.certainty - a.certainty);
    const best = results.length > 0 && results[0].certainty > 0 ? results[0] : null;

    // --- TAMBAHAN: SIMPAN KE HISTORY DATABASE ---
    if (best && username !== 'guest') {
      await this.saveToHistory(username, best);
    }
    // --------------------------------------------

    return {
      user: username,
      total_problems_analyzed: results.length,
      best_match: best,
      all_possibilities: results,
    };
  }

  // Fungsi Helper: Simpan History
  private async saveToHistory(username: string, bestResult: any) {
    const user = await this.userRepository.findOneBy({ username });
    if (user) {
      const history = this.historyRepository.create({
        user: user,
        // Sesuaikan field ini dengan entity ConsultationHistory kamu
        problem: bestResult.fullProblemData,
        consultation_date: new Date(),
        status: `Certainty: ${(bestResult.certainty * 100).toFixed(2)}%` // Simpan di field status
      });
      await this.historyRepository.save(history);
    }
  }

  // Fungsi Helper: Ambil History untuk Dashboard
  async getHistories(username: string) {
    return this.historyRepository.find({
      where: { user: { username } },
      relations: ['problem'], // Load relasi masalah biar namanya muncul
      order: { consultation_date: 'DESC' }
    });
  }

  private clamp(v: number, min = 0, max = 1) {
    if (typeof v !== 'number' || Number.isNaN(v)) return min;
    return Math.min(Math.max(v, min), max);
  }
}
