import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SuspensionProblem } from '../../suspension/problems/entities/problems.entity';
import { SuspensionSymptom } from '../../suspension/symptoms/entities/symptoms.entity';
import { SuspensionSolution } from '../../suspension/solutions/entities/solutions.entity';
import { SuspensionRule } from '../../suspension/rules/entities/rules.entity';

@Injectable()
export class SuspensionSeeder {
  constructor(private dataSource: DataSource) {}

  async run() {
    const problemRepo = this.dataSource.getRepository(SuspensionProblem);
    const symptomRepo = this.dataSource.getRepository(SuspensionSymptom);
    const solutionRepo = this.dataSource.getRepository(SuspensionSolution);
    const ruleRepo = this.dataSource.getRepository(SuspensionRule);

    console.log('Seeding Suspension Data...');

    // 1. DATA GEJALA (SYMPTOMS)
    const symptomsData = [
      { id: 'G01', name: 'Shockbreaker rembes oli' },
      { id: 'G02', name: 'Mobil limbung saat dikendarai' },
      { id: 'G03', name: 'Bunyi gluduk-gluduk saat lewat jalan rusak' },
      { id: 'G04', name: 'Setir bergetar di kecepatan tinggi' },
      { id: 'G05', name: 'Timbul bunyi cit-cit (seperti tikus) di bagian roda' },
      { id: 'G06', name: 'Ban habis tidak rata (botak sebelah)' },
      { id: 'G07', name: 'Saat direm, terdengar bunyi jedug' },
    ];

    await symptomRepo.save(symptomsData);

    // 2. DATA MASALAH (PROBLEMS) & SOLUSI
    // Kita buat Masalah dulu, baru Solusi
    const problemsData = [
      {
        id: 'P01',
        name: 'Kerusakan Shockbreaker',
        description: 'Seal shockbreaker bocor atau gas shock sudah habis.',
        solutionText: 'Wajib ganti shockbreaker baru (sepasang kanan-kiri). Jangan diservis karena tidak awet.',
      },
      {
        id: 'P02',
        name: 'Kerusakan Link Stabilizer',
        description: 'Ball joint pada link stabilizer sudah oblak atau kering.',
        solutionText: 'Ganti Link Stabilizer. Bisa pakai merk aftermarket.',
      },
      {
        id: 'P03',
        name: 'Kerusakan Bushing Arm (FCAB)',
        description: 'Karet bushing arm depan (Lollipop) pecah atau getas.',
        solutionText: 'Ganti karet bushing arm. Disarankan ganti dengan bahan Polyurethane jika ingin lebih awet.',
      },
      {
        id: 'P04',
        name: 'Kerusakan Tie Rod End',
        description: 'Ball joint pada ujung tie rod sudah aus.',
        solutionText: 'Ganti Tie Rod End dan wajib lakukan Spooring ulang setelah penggantian.',
      },
    ];

    // Simpan Masalah & Solusi
    for (const p of problemsData) {
      // a. Simpan Masalah
      const problem = await problemRepo.save({
        id: p.id,
        name: p.name,
        description: p.description,
      });

      // b. Simpan Solusi (Link ke Masalah)
      await solutionRepo.save({
        problem: problem, // Relasi OneToOne
        solution: p.solutionText,
      });
    }

    // 3. DATA ATURAN (RULES - CF Pakar)
    // Format: [Gejala ID, Masalah ID, Nilai CF (0.0 - 1.0)]
    const rulesData = [
      // Aturan untuk Shockbreaker (P01)
      ['G01', 'P01', 1.0], // Rembes oli = Pasti Shock (100%)
      ['G02', 'P01', 0.6], // Limbung = Kemungkinan Shock (60%)
      ['G03', 'P01', 0.4], // Gluduk = Bisa jadi Shock (40%)

      // Aturan untuk Link Stabilizer (P02)
      ['G03', 'P02', 0.8], // Gluduk = Sangat mungkin Link Stabilizer (80%)
      ['G02', 'P02', 0.4], // Limbung = Bisa jadi Link Stabilizer (40%)

      // Aturan untuk Bushing Arm (P03)
      ['G05', 'P03', 0.8], // Bunyi cit-cit = Khas Bushing kering (80%)
      ['G07', 'P03', 0.9], // Jedug saat rem = Khas Bushing pecah (90%)
      ['G04', 'P03', 0.5], // Setir getar = Bisa jadi bushing (50%)

      // Aturan untuk Tie Rod (P04)
      ['G04', 'P04', 0.7], // Setir getar = Yakin Tie Rod (70%)
      ['G06', 'P04', 0.8], // Ban habis ga rata = Sangat Yakin Tie Rod/Spooring (80%)
    ];

    for (const r of rulesData) {
        const [symptomId, problemId, cfValue] = r;
        
        const symptom = await symptomRepo.findOneBy({ id: symptomId as string });
        const problem = await problemRepo.findOneBy({ id: problemId as string });

        if (symptom && problem) {
            await ruleRepo.save({
                symptom: symptom,
                problem: problem,
                cfPakar: cfValue as number,
            });
        }
    }

    console.log('✅ Suspension Seeding Completed!');
  }
}