import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Problem } from '../../engine/problems/entities/problem.entity';
import { Symptom } from '../../engine/symptoms/entities/symptom.entity';
import { Solution } from '../../engine/solutions/entities/solution.entity';
import { Rule } from '../../engine/rules/entities/rule.entity';

@Injectable()
export class EngineSeeder {
  constructor(private dataSource: DataSource) {}

  async run() {
    const problemRepo = this.dataSource.getRepository(Problem);
    const symptomRepo = this.dataSource.getRepository(Symptom);
    const solutionRepo = this.dataSource.getRepository(Solution);
    const ruleRepo = this.dataSource.getRepository(Rule);

    console.log('⚙️ Seeding Engine Data (Certainty Factor Mode)...');

    // 1. DATA GEJALA (SYMPTOMS)
    // Diambil dari tabel `gejala` di SQL
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
    // Mapping Solusi berdasarkan SQL: P01->S01, P02->S05, dst.
    const problemsData = [
      {
        id: 'PE01',
        name: 'Idle Control Valve (ICV) Kotor',
        desc: 'ICV tersumbat kotoran membuat RPM tidak stabil saat beban listrik (AC) nyala.',
        solusi: 'Buka dan bersihkan Idle Control Valve (ICV) menggunakan carburetor cleaner hingga katup bisa bergerak bebas.',
      },
      {
        id: 'PE02',
        name: 'Idle Control Valve (ICV) Rusak',
        desc: 'Komponen elektris ICV sudah lemah atau mati total.',
        solusi: 'Ganti unit Idle Control Valve (ICV) dengan yang baru atau copotan yang normal.',
      },
      {
        id: 'PE03',
        name: 'Selang Air Flow / Airmass Kotor',
        desc: 'Aliran udara terhambat kotoran pada selang intake.',
        solusi: 'Lepas dan bersihkan selang air flow/airmass dan periksa filter udara.',
      },
      {
        id: 'PE04',
        name: 'Selang Air Flow / Airmass Rusak',
        desc: 'Terjadi kebocoran udara (false air) karena selang robek/pecah.',
        solusi: 'Ganti selang air flow (intake boot) dengan yang baru. Pastikan tidak ada kebocoran udara.',
      },
      {
        id: 'PE05',
        name: 'Air Flow / Airmass Sensor Rusak',
        desc: 'Sensor MAF/AFM gagal membaca massa udara, menyebabkan campuran bensin kacau.',
        solusi: 'Ganti unit Air Flow Meter / Mass Air Flow sensor. Lakukan kalibrasi CO jika diperlukan.',
      },
      {
        id: 'PE06',
        name: 'Busi No. 1 Rusak/Mati',
        desc: 'Tidak ada pengapian di silinder 1 karena busi mati.',
        solusi: 'Ganti Busi pada silinder nomor 1. Disarankan ganti 1 set (semua busi) agar performa merata.',
      },
      {
        id: 'PE07',
        name: 'Busi No. 2 Rusak/Mati',
        desc: 'Tidak ada pengapian di silinder 2.',
        solusi: 'Ganti Busi pada silinder nomor 2.',
      },
      {
        id: 'PE08',
        name: 'Busi No. 3 Rusak/Mati',
        desc: 'Tidak ada pengapian di silinder 3.',
        solusi: 'Ganti Busi pada silinder nomor 3.',
      },
      {
        id: 'PE09',
        name: 'Busi No. 4 Rusak/Mati',
        desc: 'Tidak ada pengapian di silinder 4.',
        solusi: 'Ganti Busi pada silinder nomor 4.',
      },
      {
        id: 'PE10',
        name: 'Busi No. 5 Rusak/Mati',
        desc: 'Tidak ada pengapian di silinder 5.',
        solusi: 'Ganti Busi pada silinder nomor 5.',
      },
      {
        id: 'PE11',
        name: 'Busi No. 6 Rusak/Mati',
        desc: 'Tidak ada pengapian di silinder 6.',
        solusi: 'Ganti Busi pada silinder nomor 6.',
      },
      {
        id: 'PE12',
        name: 'Ignition Coil No. 1 Rusak',
        desc: 'Koil silinder 1 lemah atau mati.',
        solusi: 'Ganti Ignition Coil pada silinder nomor 1.',
      },
      {
        id: 'PE13',
        name: 'Ignition Coil No. 2 Rusak',
        desc: 'Koil silinder 2 lemah atau mati.',
        solusi: 'Ganti Ignition Coil pada silinder nomor 2.',
      },
      {
        id: 'PE14',
        name: 'Ignition Coil No. 3 Rusak',
        desc: 'Koil silinder 3 lemah atau mati.',
        solusi: 'Ganti Ignition Coil pada silinder nomor 3.',
      },
      {
        id: 'PE15',
        name: 'Ignition Coil No. 4 Rusak',
        desc: 'Koil silinder 4 lemah atau mati.',
        solusi: 'Ganti Ignition Coil pada silinder nomor 4.',
      },
      {
        id: 'PE16',
        name: 'Ignition Coil No. 5 Rusak',
        desc: 'Koil silinder 5 lemah atau mati.',
        solusi: 'Ganti Ignition Coil pada silinder nomor 5.',
      },
      {
        id: 'PE17',
        name: 'Ignition Coil No. 6 Rusak',
        desc: 'Koil silinder 6 lemah atau mati.',
        solusi: 'Ganti Ignition Coil pada silinder nomor 6.',
      },
      {
        id: 'PE18',
        name: 'Fuel Pump Lemah',
        desc: 'Tekanan bensin dari tangki kurang kuat.',
        solusi: 'Cek tekanan bensin (pressure gauge). Jika rendah, ganti Fuel Pump (Rotax).',
      },
      {
        id: 'PE19',
        name: 'Filter Bensin Kotor',
        desc: 'Aliran bensin terhambat kotoran di filter.',
        solusi: 'Ganti Filter Bensin (Fuel Filter). Posisi biasanya di kolong mobil sebelah kiri.',
      },
      {
        id: 'PE20',
        name: 'Selang Bensin Bocor',
        desc: 'Tekanan bensin drop karena ada kebocoran di jalur selang.',
        solusi: 'Ganti selang bensin yang bocor/getas. Gunakan klem yang kuat.',
      },
      {
        id: 'PE21',
        name: 'Throttle Valve Kotor',
        desc: 'Kupu-kupu gas lengket karena kerak karbon.',
        solusi: 'Bersihkan Throttle Body/Valve menggunakan cleaner sampai bersih.',
      },
      {
        id: 'PE22',
        name: 'Throttle Switch (TPS) Rusak',
        desc: 'Sensor posisi gas error, pembacaan bukaan gas salah.',
        solusi: 'Ganti Throttle Position Switch (TPS) / Throttle Switch.',
      },
    ];

    for (const p of problemsData) {
      const problem = await problemRepo.save({
        id: p.id,
        name: p.name,
        description: p.desc,
        pict: `${p.id}.jpeg`, // Placeholder gambar
      });

      await solutionRepo.save({
        problem: problem,
        solution: p.solusi,
      });
    }

    // 3. DATA ATURAN (RULES)
    // Format: [GejalaID, MasalahID, CF_Pakar (0.0 - 1.0)]
    // Nilai CF disesuaikan dengan logika: 
    // - 0.8 untuk gejala umum
    // - 1.0 untuk gejala sangat spesifik/konfirmasi
    const rulesData = [
      // P01: ICV Kotor
      ['GE01', 'PE01', 0.6], // RPM Drop
      ['GE02', 'PE01', 0.8], // Drop pas AC nyala
      ['GE03', 'PE01', 0.6], // Deletarate AC

      // P02: ICV Rusak (Bedanya ada G04: Sudah dibersihkan tetap error)
      ['GE01', 'PE02', 0.6],
      ['GE02', 'PE02', 0.6],
      ['GE03', 'PE02', 0.6],
      ['GE04', 'PE02', 1.0], // KEY SYMPTOM: Udah dibersihin tetep error = Rusak

      // P03: Selang AF Kotor
      ['GE01', 'PE03', 0.4],
      ['GE05', 'PE03', 0.6],
      ['GE06', 'PE03', 0.6], // Tenaga hilang tanjakan
      ['GE07', 'PE03', 0.6], // Loss power
      ['GE08', 'PE03', 0.6], // Asap hitam

      // P04: Selang AF Rusak (Ada G09: Fisik rusak)
      ['GE01', 'PE04', 0.4],
      ['GE05', 'PE04', 0.6],
      ['GE06', 'PE04', 0.6],
      ['GE07', 'PE04', 0.6],
      ['GE08', 'PE04', 0.6],
      ['GE09', 'PE04', 1.0], // KEY SYMPTOM: Fisik selang pecah

      // P05: Air Flow Rusak (Ada G10: Fisik bersih tapi error)
      ['GE01', 'PE05', 0.4],
      ['GE05', 'PE05', 0.6],
      ['GE06', 'PE05', 0.6],
      ['GE07', 'PE05', 0.6],
      ['GE08', 'PE05', 0.6],
      ['GE10', 'PE05', 1.0], // KEY SYMPTOM

      // P06 - P11: Busi Rusak (Silinder 1-6)
      ['GE01', 'PE06', 0.4],
      ['GE11', 'PE06', 0.8], // Pincang/Mbrebet
      ['GE13', 'PE06', 1.0], // Cabut kabel no 1 ga berubah = Busi/Koil 1 kena
      
      ['GE01', 'PE07', 0.4], ['GE11', 'PE07', 0.8], ['GE14', 'PE07', 1.0], // Cyl 2
      ['GE01', 'PE08', 0.4], ['GE11', 'PE08', 0.8], ['GE15', 'PE08', 1.0], // Cyl 3
      ['GE01', 'PE09', 0.4], ['GE11', 'PE09', 0.8], ['GE16', 'PE09', 1.0], // Cyl 4
      ['GE01', 'PE10', 0.4], ['GE11', 'PE10', 0.8], ['GE12', 'PE10', 0.2], ['GE17', 'PE10', 1.0], // Cyl 5
      ['GE01', 'PE11', 0.4], ['GE11', 'PE11', 0.8], ['GE12', 'PE11', 0.2], ['GE18', 'PE11', 1.0], // Cyl 6

      // P12 - P17: Koil Rusak (Pembeda dengan busi: Masalah PINDAH saat ditukar)
      ['GE01', 'PE12', 0.4], ['GE11', 'PE12', 0.8], ['GE13', 'PE12', 0.8], ['GE19', 'PE12', 1.0], // Koil 1
      ['GE01', 'PE13', 0.4], ['GE11', 'PE13', 0.8], ['GE14', 'PE13', 0.8], ['GE20', 'PE13', 1.0], // Koil 2
      ['GE01', 'PE14', 0.4], ['GE11', 'PE14', 0.8], ['GE15', 'PE14', 0.8], ['GE21', 'PE14', 1.0], // Koil 3
      ['GE01', 'PE15', 0.4], ['GE11', 'PE15', 0.8], ['GE16', 'PE15', 0.8], ['GE22', 'PE15', 1.0], // Koil 4
      ['GE01', 'PE16', 0.4], ['GE11', 'PE16', 0.8], ['GE17', 'PE16', 0.8], ['GE23', 'PE16', 1.0], // Koil 5
      ['GE01', 'PE17', 0.4], ['GE11', 'PE17', 0.8], ['GE18', 'PE17', 0.8], ['GE24', 'PE17', 1.0], // Koil 6

      // P18: Fuel Pump
      ['GE25', 'PE18', 0.6], // RPM nyangkut akselerasi
      ['GE26', 'PE18', 0.8], // Nyangkut putaran tinggi
      ['GE27', 'PE18', 0.8], // Ada yang menahan

      // P19: Filter Bensin (Ada G28: Fisik tersumbat)
      ['GE25', 'PE19', 0.6],
      ['GE26', 'PE19', 0.6],
      ['GE27', 'PE19', 0.6],
      ['GE28', 'PE19', 1.0], // KEY SYMPTOM: Cek fisik bensin ga keluar

      // P20: Selang Bensin (Ada G29: Bocor)
      ['GE25', 'PE20', 0.6],
      ['GE26', 'PE20', 0.6],
      ['GE27', 'PE20', 0.6],
      ['GE29', 'PE20', 1.0], // KEY SYMPTOM: Bau bensin/netes

      // P21: Throttle Valve Kotor
      ['GE30', 'PE21', 0.8], // RPM nyangkut deselerasi
      ['GE31', 'PE21', 0.8], // Naik mulus ga mau turun
      ['GE32', 'PE21', 0.8], // Tertahan putaran rendah

      // P22: Throttle Switch Rusak (Ada G33: Sudah bersih tetep error)
      ['GE30', 'PE22', 0.6],
      ['GE31', 'PE22', 0.6],
      ['GE32', 'PE22', 0.6],
      ['GE33', 'PE22', 1.0], // KEY SYMPTOM
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

    console.log('✅ Engine Seeding Completed Successfully!');
  }
}