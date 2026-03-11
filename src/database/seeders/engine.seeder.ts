import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Problem } from '../../engine/problems/entities/problem.entity';
import { Symptom } from '../../engine/symptoms/entities/symptom.entity';
import { Solution } from '../../engine/solutions/entities/solution.entity';
import { Rule } from '../../engine/rules/entities/rule.entity';

@Injectable()
export class EngineSeeder {
  constructor(private dataSource: DataSource) { }

  async run() {
    const problemRepo = this.dataSource.getRepository(Problem);
    const symptomRepo = this.dataSource.getRepository(Symptom);
    const solutionRepo = this.dataSource.getRepository(Solution);
    const ruleRepo = this.dataSource.getRepository(Rule);

    console.log('⚙️ Seeding Engine Data (Real Certainty Factor Mode)...');

    // Membersihkan data engine lama sebelum seed ulang
    console.log('🧹 Membersihkan data engine lama...');
    await ruleRepo.query('TRUNCATE TABLE rules CASCADE');
    await solutionRepo.query('TRUNCATE TABLE solutions CASCADE');
    await problemRepo.query('TRUNCATE TABLE problems CASCADE');
    await symptomRepo.query('TRUNCATE TABLE symptoms CASCADE');

    // 1. DATA GEJALA (SYMPTOMS)
    const symptomsData = [
      { id: 'GE01', name: 'RPM turun/drop' },
      { id: 'GE02', name: 'Saat AC menyala RPM turun/drop kurang lebih 100 RPM' },
      { id: 'GE03', name: 'Perlambatan (Deaccelerate) saat AC baru menyala' },
      { id: 'GE04', name: 'Katup ICV tidak berfungsi atau tetap error setelah dibersihkan' },
      { id: 'GE05', name: 'RPM turun/drop hingga atau lebih 100 RPM' },
      { id: 'GE06', name: 'Tenaga hilang atau tidak ada tenaga saat tanjakan' },
      { id: 'GE07', name: 'Sangat terasa adanya loss (tidak ada tenaga) saat akselerasi' },
      { id: 'GE08', name: 'Asap berwarna hitam' },
      { id: 'GE09', name: 'Selang air flow/airmass terlihat rusak (robek/pecah)' },
      { id: 'GE10', name: 'Selang air flow/airmass sudah dibersihkan tapi masih error' },
      { id: 'GE11', name: 'Suara mobil pincang / menembak-nembak (mbrebet)' },
      { id: 'GE12', name: 'Mesin 6 Cylinders' },
      { id: 'GE13', name: 'Suara mesin TIDAK berubah saat kabel koil No. 1 dicabut' },
      { id: 'GE14', name: 'Suara mesin TIDAK berubah saat kabel koil No. 2 dicabut' },
      { id: 'GE15', name: 'Suara mesin TIDAK berubah saat kabel koil No. 3 dicabut' },
      { id: 'GE16', name: 'Suara mesin TIDAK berubah saat kabel koil No. 4 dicabut' },
      { id: 'GE17', name: 'Suara mesin TIDAK berubah saat kabel koil No. 5 dicabut' },
      { id: 'GE18', name: 'Suara mesin TIDAK berubah saat kabel koil No. 6 dicabut' },
      { id: 'GE19', name: 'Masalah pindah ke silinder lain saat Koil No 1 ditukar' },
      { id: 'GE20', name: 'Masalah pindah ke silinder lain saat Koil No 2 ditukar' },
      { id: 'GE21', name: 'Masalah pindah ke silinder lain saat Koil No 3 ditukar' },
      { id: 'GE22', name: 'Masalah pindah ke silinder lain saat Koil No 4 ditukar' },
      { id: 'GE23', name: 'Masalah pindah ke silinder lain saat Koil No 5 ditukar' },
      { id: 'GE24', name: 'Masalah pindah ke silinder lain saat Koil No 6 ditukar' },
      { id: 'GE25', name: 'RPM menyangkut saat akselerasi' },
      { id: 'GE26', name: 'RPM menyangkut pada putaran tinggi (4000-5000)' },
      { id: 'GE27', name: 'Terasa ada yang menahan saat akselerasi' },
      { id: 'GE28', name: 'Filter bensin tersumbat (cek fisik: bensin tidak keluar lancar)' },
      { id: 'GE29', name: 'Terdapat kebocoran pada selang bensin (bau bensin/tetesan)' },
      { id: 'GE30', name: 'RPM menyangkut saat deselerasi (tidak mau turun)' },
      { id: 'GE31', name: 'RPM naik mulus tapi tidak mau turun setelah gas dilepas' },
      { id: 'GE32', name: 'RPM tertahan pada putaran rendah (1000 - 1500)' },
      { id: 'GE33', name: 'Throttle valve sudah dibersihkan tapi masalah tetap ada' },
    ];

    await symptomRepo.save(symptomsData);

    // 2. DATA MASALAH (PROBLEMS) & SOLUSI
    const problemsData = [
      { id: 'PE01', name: 'Idle Control Valve (ICV) Kotor', desc: 'ICV tersumbat kotoran membuat RPM tidak stabil saat beban listrik (AC) nyala.', solusi: 'Buka dan bersihkan Idle Control Valve (ICV) menggunakan carburetor cleaner hingga katup bisa bergerak bebas.' },
      { id: 'PE02', name: 'Idle Control Valve (ICV) Rusak', desc: 'Komponen elektris ICV sudah lemah atau mati total.', solusi: 'Ganti unit Idle Control Valve (ICV) dengan yang baru atau copotan yang normal.' },
      { id: 'PE03', name: 'Selang Air Flow / Airmass Kotor', desc: 'Aliran udara terhambat kotoran pada selang intake.', solusi: 'Lepas dan bersihkan selang air flow/airmass dan periksa filter udara.' },
      { id: 'PE04', name: 'Selang Air Flow / Airmass Rusak', desc: 'Terjadi kebocoran udara (false air) karena selang robek/pecah.', solusi: 'Ganti selang air flow (intake boot) dengan yang baru. Pastikan tidak ada kebocoran udara.' },
      { id: 'PE05', name: 'Air Flow / Airmass Sensor Rusak', desc: 'Sensor MAF/AFM gagal membaca massa udara, menyebabkan campuran bensin kacau.', solusi: 'Ganti unit Air Flow Meter / Mass Air Flow sensor. Lakukan kalibrasi CO jika diperlukan.' },
      { id: 'PE06', name: 'Busi No. 1 Rusak/Mati', desc: 'Tidak ada pengapian di silinder 1 karena busi mati.', solusi: 'Ganti Busi pada silinder nomor 1. Disarankan ganti 1 set (semua busi) agar performa merata.' },
      { id: 'PE07', name: 'Busi No. 2 Rusak/Mati', desc: 'Tidak ada pengapian di silinder 2.', solusi: 'Ganti Busi pada silinder nomor 2.' },
      { id: 'PE08', name: 'Busi No. 3 Rusak/Mati', desc: 'Tidak ada pengapian di silinder 3.', solusi: 'Ganti Busi pada silinder nomor 3.' },
      { id: 'PE09', name: 'Busi No. 4 Rusak/Mati', desc: 'Tidak ada pengapian di silinder 4.', solusi: 'Ganti Busi pada silinder nomor 4.' },
      { id: 'PE10', name: 'Busi No. 5 Rusak/Mati', desc: 'Tidak ada pengapian di silinder 5.', solusi: 'Ganti Busi pada silinder nomor 5.' },
      { id: 'PE11', name: 'Busi No. 6 Rusak/Mati', desc: 'Tidak ada pengapian di silinder 6.', solusi: 'Ganti Busi pada silinder nomor 6.' },
      { id: 'PE12', name: 'Ignition Coil No. 1 Rusak', desc: 'Koil silinder 1 lemah atau mati.', solusi: 'Ganti Ignition Coil pada silinder nomor 1.' },
      { id: 'PE13', name: 'Ignition Coil No. 2 Rusak', desc: 'Koil silinder 2 lemah atau mati.', solusi: 'Ganti Ignition Coil pada silinder nomor 2.' },
      { id: 'PE14', name: 'Ignition Coil No. 3 Rusak', desc: 'Koil silinder 3 lemah atau mati.', solusi: 'Ganti Ignition Coil pada silinder nomor 3.' },
      { id: 'PE15', name: 'Ignition Coil No. 4 Rusak', desc: 'Koil silinder 4 lemah atau mati.', solusi: 'Ganti Ignition Coil pada silinder nomor 4.' },
      { id: 'PE16', name: 'Ignition Coil No. 5 Rusak', desc: 'Koil silinder 5 lemah atau mati.', solusi: 'Ganti Ignition Coil pada silinder nomor 5.' },
      { id: 'PE17', name: 'Ignition Coil No. 6 Rusak', desc: 'Koil silinder 6 lemah atau mati.', solusi: 'Ganti Ignition Coil pada silinder nomor 6.' },
      { id: 'PE18', name: 'Fuel Pump Lemah', desc: 'Tekanan bensin dari tangki kurang kuat.', solusi: 'Cek tekanan bensin (pressure gauge). Jika rendah, ganti Fuel Pump (Rotax).' },
      { id: 'PE19', name: 'Filter Bensin Kotor', desc: 'Aliran bensin terhambat kotoran di filter.', solusi: 'Ganti Filter Bensin (Fuel Filter). Posisi biasanya di kolong mobil sebelah kiri.' },
      { id: 'PE20', name: 'Selang Bensin Bocor', desc: 'Tekanan bensin drop karena ada kebocoran di jalur selang.', solusi: 'Ganti selang bensin yang bocor/getas. Gunakan klem yang kuat.' },
      { id: 'PE21', name: 'Throttle Valve Kotor', desc: 'Kupu-kupu gas lengket karena kerak karbon.', solusi: 'Bersihkan Throttle Body/Valve menggunakan cleaner sampai bersih.' },
      { id: 'PE22', name: 'Throttle Switch (TPS) Rusak', desc: 'Sensor posisi gas error, pembacaan bukaan gas salah.', solusi: 'Ganti Throttle Position Switch (TPS) / Throttle Switch.' },
    ];

    for (const p of problemsData) {
      const problem = await problemRepo.save({
        id: p.id,
        name: p.name,
        description: p.desc,
        pict: `${p.id}.jpeg`,
      });

      await solutionRepo.save({
        problem: problem,
        solution: p.solusi,
      });
    }

    // 3. DATA ATURAN (RULES) - 88 RULES BERDASARKAN HASIL WAWANCARA REAL
    const rulesData = [
      // PE01: ICV Kotor (RE01-RE03)
      ['GE03', 'PE01', 0.9], // RE01 - Hampir Pasti
      ['GE01', 'PE01', 0.7], // RE02 - Yakin
      ['GE02', 'PE01', 0.9], // RE03 - Hampir Pasti

      // PE02: ICV Rusak (RE04-RE07)
      ['GE01', 'PE02', 0.7], // RE04 - Yakin
      ['GE03', 'PE02', 0.9], // RE05 - Hampir Pasti
      ['GE02', 'PE02', 0.9], // RE06 - Hampir Pasti
      ['GE04', 'PE02', 1.0], // RE07 - Sangat Pasti

      // PE03: Selang AF Kotor (RE08-RE12)
      ['GE08', 'PE03', 0.8], // RE08 - Sangat Yakin
      ['GE01', 'PE03', 0.7], // RE09 - Yakin
      ['GE05', 'PE03', 0.8], // RE10 - Sangat Yakin
      ['GE07', 'PE03', 0.9], // RE11 - Hampir Pasti
      ['GE06', 'PE03', 0.9], // RE12 - Hampir Pasti

      // PE04: Selang AF Rusak (RE13-RE18)
      ['GE01', 'PE04', 0.7], // RE13 - Yakin
      ['GE05', 'PE04', 0.9], // RE14 - Hampir Pasti
      ['GE06', 'PE04', 0.9], // RE15 - Hampir Pasti
      ['GE07', 'PE04', 0.9], // RE16 - Hampir Pasti
      ['GE08', 'PE04', 0.8], // RE17 - Sangat Yakin
      ['GE09', 'PE04', 1.0], // RE18 - Sangat Pasti

      // PE05: Air Flow / Airmass Rusak (RE19-RE24)
      ['GE01', 'PE05', 0.7], // RE19 - Yakin
      ['GE05', 'PE05', 0.9], // RE20 - Hampir Pasti
      ['GE06', 'PE05', 0.9], // RE21 - Hampir Pasti
      ['GE07', 'PE05', 0.9], // RE22 - Hampir Pasti
      ['GE08', 'PE05', 0.8], // RE23 - Sangat Yakin
      ['GE10', 'PE05', 1.0], // RE24 - Sangat Pasti

      // PE06: Busi No. 1 Rusak (RE25-RE27)
      ['GE13', 'PE06', 1.0], // RE25 - Sangat Pasti
      ['GE11', 'PE06', 0.9], // RE26 - Hampir Pasti
      ['GE01', 'PE06', 0.8], // RE27 - Sangat Yakin

      // PE07: Busi No. 2 Rusak (RE28-RE30)
      ['GE01', 'PE07', 0.8], // RE28 - Sangat Yakin
      ['GE11', 'PE07', 0.9], // RE29 - Hampir Pasti
      ['GE14', 'PE07', 1.0], // RE30 - Sangat Pasti

      // PE08: Busi No. 3 Rusak (RE31-RE33)
      ['GE11', 'PE08', 0.9], // RE31 - Hampir Pasti
      ['GE01', 'PE08', 0.8], // RE32 - Sangat Yakin
      ['GE15', 'PE08', 1.0], // RE33 - Sangat Pasti

      // PE09: Busi No. 4 Rusak (RE34-RE36)
      ['GE11', 'PE09', 0.9], // RE34 - Hampir Pasti
      ['GE01', 'PE09', 0.8], // RE35 - Sangat Yakin
      ['GE16', 'PE09', 1.0], // RE36 - Sangat Pasti

      // PE10: Busi No. 5 Rusak (RE37-RE40)
      ['GE01', 'PE10', 0.8], // RE37 - Sangat Yakin
      ['GE12', 'PE10', 0.8], // RE38 - Sangat Yakin
      ['GE17', 'PE10', 1.0], // RE39 - Sangat Pasti
      ['GE11', 'PE10', 0.9], // RE40 - Hampir Pasti

      // PE11: Busi No. 6 Rusak (RE41-RE44)
      ['GE01', 'PE11', 0.8], // RE41 - Sangat Yakin
      ['GE11', 'PE11', 0.9], // RE42 - Hampir Pasti
      ['GE12', 'PE11', 0.8], // RE43 - Sangat Yakin
      ['GE18', 'PE11', 1.0], // RE44 - Sangat Pasti

      // PE12: Ignition Coil No. 1 Rusak (RE45-RE48)
      ['GE13', 'PE12', 0.9], // RE45 - Hampir Pasti
      ['GE11', 'PE12', 0.9], // RE46 - Hampir Pasti
      ['GE01', 'PE12', 0.8], // RE47 - Sangat Yakin
      ['GE19', 'PE12', 1.0], // RE48 - Sangat Pasti

      // PE13: Ignition Coil No. 2 Rusak (RE49-RE52)
      ['GE01', 'PE13', 0.8], // RE49 - Sangat Yakin
      ['GE11', 'PE13', 0.9], // RE50 - Hampir Pasti
      ['GE20', 'PE13', 1.0], // RE51 - Sangat Pasti
      ['GE14', 'PE13', 0.9], // RE52 - Hampir Pasti

      // PE14: Ignition Coil No. 3 Rusak (RE53-RE56)
      ['GE01', 'PE14', 0.8], // RE53 - Sangat Yakin
      ['GE11', 'PE14', 0.9], // RE54 - Hampir Pasti
      ['GE15', 'PE14', 0.9], // RE55 - Hampir Pasti
      ['GE21', 'PE14', 1.0], // RE56 - Sangat Pasti

      // PE15: Ignition Coil No. 4 Rusak (RE57-RE60)
      ['GE01', 'PE15', 0.8], // RE57 - Sangat Yakin
      ['GE11', 'PE15', 0.9], // RE58 - Hampir Pasti
      ['GE16', 'PE15', 0.9], // RE59 - Hampir Pasti
      ['GE22', 'PE15', 1.0], // RE60 - Sangat Pasti

      // PE16: Ignition Coil No. 5 Rusak (RE61-RE65)
      ['GE01', 'PE16', 0.8], // RE61 - Sangat Yakin
      ['GE11', 'PE16', 0.9], // RE62 - Hampir Pasti
      ['GE12', 'PE16', 0.8], // RE63 - Sangat Yakin (Mesin 6 Cylinders)
      ['GE17', 'PE16', 0.9], // RE64 - Hampir Pasti
      ['GE23', 'PE16', 1.0], // RE65 - Sangat Pasti

      // PE17: Ignition Coil No. 6 Rusak (RE66-RE70)
      ['GE24', 'PE17', 1.0], // RE66 - Sangat Pasti
      ['GE12', 'PE17', 0.8], // RE67 - Sangat Yakin (Mesin 6 Cylinders)
      ['GE01', 'PE17', 0.8], // RE68 - Sangat Yakin
      ['GE11', 'PE17', 0.9], // RE69 - Hampir Pasti
      ['GE18', 'PE17', 0.9], // RE70 - Hampir Pasti

      // PE18: Fuel Pump Lemah (RE71-RE73)
      ['GE26', 'PE18', 0.9], // RE71 - Hampir Pasti
      ['GE25', 'PE18', 0.8], // RE72 - Sangat Yakin
      ['GE27', 'PE18', 0.9], // RE73 - Hampir Pasti

      // PE19: Filter Bensin Kotor (RE74-RE77)
      ['GE26', 'PE19', 0.8], // RE74 - Sangat Yakin
      ['GE27', 'PE19', 0.8], // RE75 - Sangat Yakin
      ['GE28', 'PE19', 1.0], // RE76 - Sangat Pasti
      ['GE25', 'PE19', 0.8], // RE77 - Sangat Yakin

      // PE20: Selang Bensin Bocor (RE78-RE81)
      ['GE27', 'PE20', 0.9], // RE78 - Hampir Pasti
      ['GE26', 'PE20', 0.8], // RE79 - Sangat Yakin
      ['GE25', 'PE20', 0.8], // RE80 - Sangat Yakin
      ['GE29', 'PE20', 1.0], // RE81 - Sangat Pasti

      // PE21: Throttle Valve Kotor (RE82-RE84)
      ['GE30', 'PE21', 0.9], // RE82 - Hampir Pasti
      ['GE32', 'PE21', 0.8], // RE83 - Sangat Yakin
      ['GE31', 'PE21', 0.9], // RE84 - Hampir Pasti

      // PE22: Throttle Switch Rusak (RE85-RE88)
      ['GE30', 'PE22', 0.8], // RE85 - Sangat Yakin
      ['GE31', 'PE22', 0.8], // RE86 - Sangat Yakin
      ['GE32', 'PE22', 0.8], // RE87 - Sangat Yakin
      ['GE33', 'PE22', 1.0], // RE88 - Sangat Pasti
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

    console.log('✅ Engine Seeding with Real Expert Data Completed!');
  }
}