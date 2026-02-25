import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SuspensionProblem } from '../../suspension/problems/entities/problems.entity';
import { SuspensionSymptom } from '../../suspension/symptoms/entities/symptoms.entity';
import { SuspensionSolution } from '../../suspension/solutions/entities/solutions.entity';
import { SuspensionRule } from '../../suspension/rules/entities/rules.entity';

@Injectable()
export class SuspensionSeeder {
  constructor(private dataSource: DataSource) { }

  async run() {
    const problemRepo = this.dataSource.getRepository(SuspensionProblem);
    const symptomRepo = this.dataSource.getRepository(SuspensionSymptom);
    const solutionRepo = this.dataSource.getRepository(SuspensionSolution);
    const ruleRepo = this.dataSource.getRepository(SuspensionRule);

    console.log('🧹 Membersihkan data suspensi lama...');
    // Hapus data dari tabel relasi (rules & solutions) terlebih dahulu
    await ruleRepo.query('TRUNCATE TABLE suspension_rules CASCADE');
    await solutionRepo.query('TRUNCATE TABLE suspension_solutions CASCADE');
    // Baru hapus data induknya
    await problemRepo.query('TRUNCATE TABLE suspension_problems CASCADE');
    await symptomRepo.query('TRUNCATE TABLE suspension_symptoms CASCADE');

    console.log('🚗 Seeding Fixed Suspension Data (Revised by Expert)...');

    const rawData = [
      { s: "Roda panas dan bau seperti terbakar", p: "Kampas rem macet", cf: 0.8, sol: "Wajib Ganti Baru" },
      { s: "Mobil limbung saat dikendarai", p: "Kerusakan pada Shockbreaker", cf: 0.8, sol: "Wajib Ganti Baru" },
      { s: "Bunyi saat ada polisi tidur", p: "Kerusakan pada Karet Support Shock", cf: 0.8, sol: "Wajib Ganti Baru" },
      { s: "Bunyi saat ada polisi tidur", p: "Kerusakan pada Link Stabilizer", cf: 0.7, sol: "Wajib Ganti Baru" },
      { s: "Mobil lebih pendek dari yang seharusnya", p: "Kerusakan pada Per (Spring)", cf: 0.7, sol: "Wajib Ganti Baru" },
      { s: "Mobil lebih pendek dari yang seharusnya", p: "Kerusakan pada Shockbreaker", cf: 0.6, sol: "Wajib Ganti Baru" },
      { s: "Bunyi berdecit", p: "Kampas rem macet", cf: 0.8, sol: "Service/Rekondisi" },
      { s: "Bunyi berdecit", p: "Piringan cakram bergelombang", cf: 0.6, sol: "Wajib Ganti Baru" },
      { s: "Setir Oblak/Bunyi", p: "Kerusakan pada Long Tie Rod (Rack End)", cf: 0.6, sol: "Wajib Ganti Baru" },
      { s: "Bantingan Keras", p: "Kerusakan pada Shockbreaker", cf: 0.6, sol: "Service/Rekondisi" },
      { s: "Bunyi jedug saat di rem", p: "Kerusakan pada Bushing Arm Depan (FCAB / Lollipop)", cf: 0.9, sol: "Wajib Ganti Baru" },
      { s: "Bunyi jedug saat mundur", p: "Mounting gardan rusak", cf: 0.8, sol: "Wajib Ganti Baru" },
      { s: "Bunyi dengkuran", p: "Kerusakan  piringan roda", cf: 0.6, sol: "Wajib Ganti Baru" },
      { s: "Arah roda berubah/Oblag", p: "Kerusakan pada Rack Steer", cf: 0.8, sol: "Service/Rekondisi" },
      { s: "Arah roda berubah/Oblag", p: "Kerusakan pada Tie Rod End", cf: 0.7, sol: "Wajib Ganti Baru" },
      { s: "Timbul bunyi 'gluduk-gluduk' (terutama jalan rusak)", p: "Kerusakan pada Link Stabilizer", cf: 0.7, sol: "Wajib Ganti Baru" },
      { s: "Timbul bunyi 'gluduk-gluduk' (terutama jalan rusak)", p: "Kerusakan pada Ball Joint", cf: 0.8, sol: "Wajib Ganti Baru" },
      { s: "Roda bergoyang/geol", p: "Kerusakan pada Tie Rod", cf: 0.6, sol: "Wajib Ganti Baru" },
      { s: "Roda bergoyang/geol", p: "Kerusakan pada Bearing", cf: 0.6, sol: "Wajib Ganti Baru" },
      { s: "Roda bergoyang/geol", p: "Kerusakan pada Ball Joint", cf: 0.8, sol: "Wajib Ganti Baru" },
      { s: "Muncul bunyi dengung (seiring kecepatan)", p: "Kerusakan pada Wheel Bearing (Laher Roda)", cf: 0.9, sol: "Wajib Ganti Baru" },
      { s: "Bunyi saat jalan kerikil", p: "Kerusakan pada Link Stabilizer", cf: 0.8, sol: "Wajib Ganti Baru" },
      { s: "Bunyi saat jalan kerikil", p: "Kerusakan pada Tie Rod End", cf: 0.6, sol: "Wajib Ganti Baru" },
      { s: "Rem terasa keras", p: "Masalah pada Booster Rem", cf: 0.9, sol: "Wajib Ganti Baru" },
      { s: "Rem terasa keras", p: "Masalah pada vacum rem", cf: 0.8, sol: "Wajib Ganti Baru" },
      { s: "Bunyi saat berbelok", p: "Kerusakan pada Power Steering Pump", cf: 0.8, sol: "Wajib Ganti Baru" },
      { s: "Bunyi saat berbelok", p: "Kerusakan pada Rack Steer", cf: 0.7, sol: "Wajib Ganti Baru" },
      { s: "Bunyi saat masuk gigi", p: "Kerusakan pada Karet Kopel (Guibo/Flex Disc)", cf: 0.6, sol: "Wajib Ganti Baru" },
      { s: "Bunyi saat masuk gigi", p: "Kerusakan pada Karet Kopel Mounting Transmisi", cf: 0.7, sol: "Wajib Ganti Baru" },
      { s: "Bunyi saat lepas kopling", p: "Kerusakan pada Release Bearing", cf: 0.7, sol: "Wajib Ganti Baru" },
      { s: "Bunyi saat lepas kopling", p: "Kerusakan pada Cross Joint", cf: 0.5, sol: "Wajib Ganti Baru" },
      { s: "Bunyi saat kecepatan diatas 60 km", p: "Kerusakan pada Center Support Bearing (Gantungan Kopel)", cf: 0.6, sol: "Wajib Ganti Baru" },
      { s: "Bunyi saat kecepatan diatas 100 km", p: "Masalah Balancing Roda", cf: 0.6, sol: "Wajib Ganti Baru" },
      { s: "Bunyi saat kecepatan diatas 100 km", p: "Masalah propeller Shaft tidak balance", cf: 0.7, sol: "Wajib Ganti Baru" },
      { s: "Bunyi di jalan kasar kanan belakang", p: "Kerusakan pada Shock Mount Belakang (Top Mount)", cf: 0.5, sol: "Wajib Ganti Baru" },
      { s: "Bunyi di jalan kasar kanan belakang", p: "Kerusakan pada Shockbreaker", cf: 0.5, sol: "Wajib Ganti Baru" },
      { s: "Bunyi di jalan kasar kiri belakang", p: "Kerusakan pada Shock Mount Belakang (Top Mount)", cf: 0.6, sol: "Wajib Ganti Baru" },
      { s: "Bunyi di jalan kasar kiri belakang", p: "Kerusakan pada Shockbreaker", cf: 0.7, sol: "Wajib Ganti Baru" },
      { s: "Body getar seluruh body", p: "Kerusakan pada Shaft (Kopel)", cf: 0.8, sol: "Wajib Ganti Baru" },
      { s: "Body getar seluruh body", p: "Kerusakan pada Engine Mounting", cf: 0.7, sol: "Wajib Ganti Baru" },
      { s: "Body getar di tengah", p: "Kerusakan pada Center Support Bearing", cf: 0.9, sol: "Wajib Ganti Baru" },
      { s: "Body getar di tengah", p: "Kerusakan pada Cross Joint", cf: 0.7, sol: "Wajib Ganti Baru" },
      { s: "Bunyi gluk di body saat oper gigi", p: "Kerusakan pada bushing propelershaft", cf: 0.8, sol: "Wajib Ganti Baru" },
      { s: "Bunyi gluk di body saat oper gigi", p: "Kerusakan pada Subframe", cf: 0.6, sol: "Wajib Ganti Baru" },
      { s: "Setir berat ke kanan dan ke kiri", p: "Kerusakan pada Pompa Power Steering", cf: 0.6, sol: "Service/Rekondisi" },
      { s: "Setir berat ke kanan dan ke kiri", p: "Kerusakan pada Rack Steer (Seal Bocor)", cf: 0.7, sol: "Service/Rekondisi" },
      { s: "Setir berat ke kiri aja atau kanan aja", p: "Perlu Spooring (Alignment)", cf: 0.8, sol: "Service/Rekondisi" },
      { s: "Setir berat ke kiri aja atau kanan aja", p: "Masalah pada Rack Steer (Valve)", cf: 0.6, sol: "Service/Rekondisi" },
      { s: "Ban bunyi gemuruh", p: "Kerusakan pada Wheel Bearing (Laher Roda)", cf: 0.7, sol: "Wajib Ganti Baru" },
      { s: "Ban bunyi gemuruh", p: "Kerusakan pada Ban Aus Tidak Rata (Cupping)", cf: 0.8, sol: "Wajib Ganti Baru" },
      { s: "Ban bunyi cling cling", p: "Plat Pelindung (Dust Shield) Bengkok", cf: 0.6, sol: "Service/Rekondisi" },
      { s: "Ban bunyi cling cling", p: "Klip Kampas Rem Lepas", cf: 0.4, sol: "Wajib Ganti Baru" },
      { s: "Bunyi dengung body belakang /tengah", p: "Kerusakan pada Wheel Bearing Belakang", cf: 0.9, sol: "Wajib Ganti Baru" },
      { s: "Bunyi dengung body belakang /tengah", p: "Kerusakan pada Gardan (Differential)", cf: 0.7, sol: "Wajib Ganti Baru" },
      { s: "Setir bergetar saat ngerem", p: "Piringan cakram bergelombang", cf: 0.5, sol: "Service/Rekondisi" },
      { s: "Mobil narik ke satu sisi saat direm", p: "Kaliper rem macet sebelah", cf: 0.7, sol: "Wajib Ganti Baru" },
      { s: "Mobil terasa melayang di kecepatan tinggi", p: "Shockbreaker mulai lemah", cf: 0.8, sol: "Wajib Ganti Baru" },
      { s: "Mobil tidak stabil saat pindah jalur", p: "Bushing arm depan aus", cf: 0.5, sol: "Wajib Ganti Baru" },
      { s: "Setir tidak kembali lurus", p: "FCAB / Rack steer mulai aus", cf: 0.6, sol: "Service/Rekondisi" },
      { s: "Setir berat saat parkir", p: "Tekanan ban / rack mulai berat", cf: 0.6, sol: "Service/Rekondisi" },
    ];

    // Map unik untuk Symptom dan Problem agar tidak duplikat di DB
    const symptomsMap = new Map();
    const problemsMap = new Map();

    for (let i = 0; i < rawData.length; i++) {
      const item = rawData[i];

      // Normalize strings untuk menghindari duplikasi karena spasi
      const normalizedSymptom = item.s.trim();
      const normalizedProblem = item.p.trim();

      // 1. Simpan Symptom jika belum ada
      if (!symptomsMap.has(normalizedSymptom)) {
        const sId = `GS${(symptomsMap.size + 1).toString().padStart(2, '0')}`;
        const newS = await symptomRepo.save({ id: sId, name: normalizedSymptom });
        symptomsMap.set(normalizedSymptom, newS);
      }

      // 2. Simpan Problem & Solution jika belum ada
      if (!problemsMap.has(normalizedProblem)) {
        const pId = `PS${(problemsMap.size + 1).toString().padStart(2, '0')}`;
        const newP = await problemRepo.save({
          id: pId,
          name: normalizedProblem,
          description: `Masalah terdeteksi pada sistem suspensi: ${normalizedProblem}`
        });

        await solutionRepo.save({
          problem: newP,
          solution: item.sol,
        });

        problemsMap.set(normalizedProblem, newP);
      }

      // 3. Simpan Rule (Relasi Symptom -> Problem + CF Pakar)
      await ruleRepo.save({
        symptom: symptomsMap.get(normalizedSymptom),
        problem: problemsMap.get(normalizedProblem),
        cfPakar: item.cf,
      });
    }

    console.log('✅ Suspension Seeding Completed Successfully!');
  }
}