import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm'; // Tambah 'In'

import { SuspensionRule } from '../rules/entities/rules.entity';
import { SuspensionProblem } from '../problems/entities/problems.entity';
import { ConsultationProcessDto } from './dto/consultation-process.dto';

@Injectable()
export class ConsultationsService {
  start() {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(SuspensionRule)
    private ruleRepo: Repository<SuspensionRule>,
    // Repository lain mungkin tidak perlu di-inject jika sudah pakai relation
  ) {}

  async process(username: string, dto: ConsultationProcessDto) {
    // 1. OPTIMASI PERTAMA: Ambil ID gejala yang dipilih user saja
    const symptomIds = dto.symptoms.map(s => s.symptomId);

    if (symptomIds.length === 0) {
        return { best: null, ranking: [] };
    }

    // 2. OPTIMASI KEDUA: Fetch Rules + Problem + Solution SEKALIGUS
    // Pastikan di entity Problem sudah ada relasi @OneToOne ke Solution ya!
    const rules = await this.ruleRepo.find({
      where: {
        symptom: { id: In(symptomIds) } // Cuma ambil rule yang relevan (Filter di DB)
      },
      relations: [
        'problem', 
        'symptom', 
        'problem.solution' // JOIN tabel solusi di sini (Eager loading)
      ],
    });

    // Grouping rules by problemId
    const grouped: Record<string, SuspensionRule[]> = {};
    for (const r of rules) {
      const pid = r.problem.id;
      if (!grouped[pid]) grouped[pid] = [];
      grouped[pid].push(r);
    }

    const results: any[] = [];

    // 3. Loop perhitungan (Logic kamu yg ini sudah mantap!)
    for (const pid of Object.keys(grouped)) {
      let CFold = 0;
      const rulesForProblem = grouped[pid];
      
      // Ambil data masalah & solusi dari rule pertama (karena sudah di-load di awal)
      const problem = rulesForProblem[0].problem;
      // Ambil solusi dari relasi problem (bukan query ulang)
      const solutionText = problem.solution ? problem.solution.solution : null; 

      for (const rule of rulesForProblem) {
        const ans = dto.symptoms.find((s) => s.symptomId === rule.symptom.id);
        if (!ans) continue;

        const CF_user = this.clamp(ans.userCf, 0, 1);
        const CF_expert = this.clamp(rule.cfPakar ?? 0.8, 0, 1); // Default 0.8 aman
        const CF_temp = CF_user * CF_expert;

        CFold = CFold + CF_temp * (1 - CFold);
      }

      results.push({
        problemId: pid,
        problemName: problem.name, // Pastikan property di entity 'name' atau 'nama_masalah'
        certainty: CFold,
        formattedCertainty: (CFold * 100).toFixed(2) + '%', // Tambahan manis buat frontend
        solution: solutionText,
      });
    }

    // 4. Sort Descending
    results.sort((a, b) => b.certainty - a.certainty);

    // Ambil hasil terbaik (misal threshold minimal 0.01 biar yang 0% gak ikut)
    const best = results.length > 0 && results[0].certainty > 0 ? results[0] : null;

    return {
      user: username,
      total_problems_analyzed: results.length,
      best_match: best,
      all_possibilities: results,
    };
  }

  // Helper function jadi private method
  private clamp(v: number, min = 0, max = 1) {
    if (typeof v !== 'number' || Number.isNaN(v)) return min;
    return Math.min(Math.max(v, min), max);
  }
}