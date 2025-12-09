import { DataSource } from 'typeorm';
import { SuspensionSymptom } from '../../suspension/symptoms/entities/symptoms.entity';
import { SuspensionProblem } from '../../suspension/problems/entities/problems.entity';
import { SuspensionRule } from '../../suspension/rules/entities/rules.entity';

export class SuspensionSeeder {
  constructor(private dataSource: DataSource) {}

  async run() {
    console.log('🌱 Seeding Suspension Module...');

    const symptomRepo = this.dataSource.getRepository(SuspensionSymptom);
    const problemRepo = this.dataSource.getRepository(SuspensionProblem);
    const ruleRepo = this.dataSource.getRepository(SuspensionRule);

    // ---------- CLEAR OLD DATA (opsional) ----------
    await ruleRepo.delete({});
    await symptomRepo.delete({});
    await problemRepo.delete({});

    // ---------- INSERT SYMPTOMS ----------
    const s1 = symptomRepo.create({
      id: 'SUSP_G01',
      name: 'Suspensi terasa keras',
      description: 'Suspensi terasa keras saat melewati polisi tidur',
      media: null,
    });

    const s2 = symptomRepo.create({
      id: 'SUSP_G02',
      name: 'Mobil tidak stabil',
      description: 'Kendali terasa goyang pada kecepatan tinggi',
      media: null,
    });

    await symptomRepo.save([s1, s2]);

    // ---------- INSERT PROBLEMS ----------
    const p1 = problemRepo.create({
      id: 'SUSP_P01',
      name: 'Shockbreaker rusak',
      description: 'Shockbreaker sudah tidak mampu meredam getaran.',
      pict: null,
    });

    await problemRepo.save(p1);

    // ---------- INSERT RULES (CF) ----------
    // Rule harus mengacu ke entitas problem & symptom
    const r1 = ruleRepo.create({
      problem: p1,          // bisa juga gunakan { id: 'SUSP_P01' } jika prefer relation by id
      symptom: s1,
      expertCf: 0.8,
    });

    const r2 = ruleRepo.create({
      problem: p1,
      symptom: s2,
      expertCf: 0.6,
    });

    await ruleRepo.save([r1, r2]);

    console.log('✅ Suspension seeding completed!');
  }
}
