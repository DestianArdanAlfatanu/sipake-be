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
      { id: 'G01', name: 'RPM turun/drop' },
      { id: 'G02', name: 'Saat AC menyala RPM turun/drop kurang lebih 100 RPM' },
      { id: 'G03', name: 'Perlambatan (Deaccelerate) saat AC baru menyala' },
      { id: 'G04', name: 'Katup ICV tidak berfungsi atau tetap error setelah dibersihkan' },
      { id: 'G05', name: 'RPM turun/drop hingga atau lebih 100 RPM' },
      { id: 'G06', name: 'Tenaga hilang atau tidak ada tenaga saat tanjakan' },
      { id: 'G07', name: 'Sangat terasa adanya loss (tidak ada tenaga) saat akselerasi' },
      { id: 'G08', name: 'Asap berwarna hitam' },
      { id: 'G09', name: 'Selang air flow/airmass terlihat rusak (robek/pecah)' },
      { id: 'G10', name: 'Selang air flow/airmass sudah dibersihkan tapi masih error' },
      { id: 'G11', name: 'Suara mobil pincang / menembak-nembak (mbrebet)' },
      { id: 'G12', name: 'Mesin 6 Cylinders' },
      { id: 'G13', name: 'Suara mesin TIDAK berubah saat kabel koil No. 1 dicabut' },
      { id: 'G14', name: 'Suara mesin TIDAK berubah saat kabel koil No. 2 dicabut' },
      { id: 'G15', name: 'Suara mesin TIDAK berubah saat kabel koil No. 3 dicabut' },
      { id: 'G16', name: 'Suara mesin TIDAK berubah saat kabel koil No. 4 dicabut' },
      { id: 'G17', name: 'Suara mesin TIDAK berubah saat kabel koil No. 5 dicabut' },
      { id: 'G18', name: 'Suara mesin TIDAK berubah saat kabel koil No. 6 dicabut' },
      { id: 'G19', name: 'Masalah pindah ke silinder lain saat Koil No 1 ditukar' },
      { id: 'G20', name: 'Masalah pindah ke silinder lain saat Koil No 2 ditukar' },
      { id: 'G21', name: 'Masalah pindah ke silinder lain saat Koil No 3 ditukar' },
      { id: 'G22', name: 'Masalah pindah ke silinder lain saat Koil No 4 ditukar' },
      { id: 'G23', name: 'Masalah pindah ke silinder lain saat Koil No 5 ditukar' },
      { id: 'G24', name: 'Masalah pindah ke silinder lain saat Koil No 6 ditukar' },
      { id: 'G25', name: 'RPM menyangkut saat akselerasi' },
      { id: 'G26', name: 'RPM menyangkut pada putaran tinggi (4000-5000)' },
      { id: 'G27', name: 'Terasa ada yang menahan saat akselerasi' },
      { id: 'G28', name: 'Filter bensin tersumbat (cek fisik: bensin tidak keluar lancar)' },
      { id: 'G29', name: 'Terdapat kebocoran pada selang bensin (bau bensin/tetesan)' },
      { id: 'G30', name: 'RPM menyangkut saat deselerasi (tidak mau turun)' },
      { id: 'G31', name: 'RPM naik mulus tapi tidak mau turun setelah gas dilepas' },
      { id: 'G32', name: 'RPM tertahan pada putaran rendah (1000 - 1500)' },
      { id: 'G33', name: 'Throttle valve sudah dibersihkan tapi masalah tetap ada' },
    ];

    await symptomRepo.save(symptomsData);

    // 2. DATA MASALAH (PROBLEMS) & SOLUSI
    // Mapping Solusi berdasarkan SQL: P01->S01, P02->S05, dst.
    const problemsData = [
      {
        id: 'P01',
        name: 'Idle Control Valve (ICV) Kotor',
        desc: 'ICV tersumbat kotoran membuat RPM tidak stabil saat beban listrik (AC) nyala.',
        solusi: 'Buka dan bersihkan Idle Control Valve (ICV) menggunakan carburetor cleaner hingga katup bisa bergerak bebas.',
      },
      {
        id: 'P02',
        name: 'Idle Control Valve (ICV) Rusak',
        desc: 'Komponen elektris ICV sudah lemah atau mati total.',
        solusi: 'Ganti unit Idle Control Valve (ICV) dengan yang baru atau copotan yang normal.',
      },
      {
        id: 'P03',
        name: 'Selang Air Flow / Airmass Kotor',
        desc: 'Aliran udara terhambat kotoran pada selang intake.',
        solusi: 'Lepas dan bersihkan selang air flow/airmass dan periksa filter udara.',
      },
      {
        id: 'P04',
        name: 'Selang Air Flow / Airmass Rusak',
        desc: 'Terjadi kebocoran udara (false air) karena selang robek/pecah.',
        solusi: 'Ganti selang air flow (intake boot) dengan yang baru. Pastikan tidak ada kebocoran udara.',
      },
      {
        id: 'P05',
        name: 'Air Flow / Airmass Sensor Rusak',
        desc: 'Sensor MAF/AFM gagal membaca massa udara, menyebabkan campuran bensin kacau.',
        solusi: 'Ganti unit Air Flow Meter / Mass Air Flow sensor. Lakukan kalibrasi CO jika diperlukan.',
      },
      {
        id: 'P06',
        name: 'Busi No. 1 Rusak/Mati',
        desc: 'Tidak ada pengapian di silinder 1 karena busi mati.',
        solusi: 'Ganti Busi pada silinder nomor 1. Disarankan ganti 1 set (semua busi) agar performa merata.',
      },
      {
        id: 'P07',
        name: 'Busi No. 2 Rusak/Mati',
        desc: 'Tidak ada pengapian di silinder 2.',
        solusi: 'Ganti Busi pada silinder nomor 2.',
      },
      {
        id: 'P08',
        name: 'Busi No. 3 Rusak/Mati',
        desc: 'Tidak ada pengapian di silinder 3.',
        solusi: 'Ganti Busi pada silinder nomor 3.',
      },
      {
        id: 'P09',
        name: 'Busi No. 4 Rusak/Mati',
        desc: 'Tidak ada pengapian di silinder 4.',
        solusi: 'Ganti Busi pada silinder nomor 4.',
      },
      {
        id: 'P10',
        name: 'Busi No. 5 Rusak/Mati',
        desc: 'Tidak ada pengapian di silinder 5.',
        solusi: 'Ganti Busi pada silinder nomor 5.',
      },
      {
        id: 'P11',
        name: 'Busi No. 6 Rusak/Mati',
        desc: 'Tidak ada pengapian di silinder 6.',
        solusi: 'Ganti Busi pada silinder nomor 6.',
      },
      {
        id: 'P12',
        name: 'Ignition Coil No. 1 Rusak',
        desc: 'Koil silinder 1 lemah atau mati.',
        solusi: 'Ganti Ignition Coil pada silinder nomor 1.',
      },
      {
        id: 'P13',
        name: 'Ignition Coil No. 2 Rusak',
        desc: 'Koil silinder 2 lemah atau mati.',
        solusi: 'Ganti Ignition Coil pada silinder nomor 2.',
      },
      {
        id: 'P14',
        name: 'Ignition Coil No. 3 Rusak',
        desc: 'Koil silinder 3 lemah atau mati.',
        solusi: 'Ganti Ignition Coil pada silinder nomor 3.',
      },
      {
        id: 'P15',
        name: 'Ignition Coil No. 4 Rusak',
        desc: 'Koil silinder 4 lemah atau mati.',
        solusi: 'Ganti Ignition Coil pada silinder nomor 4.',
      },
      {
        id: 'P16',
        name: 'Ignition Coil No. 5 Rusak',
        desc: 'Koil silinder 5 lemah atau mati.',
        solusi: 'Ganti Ignition Coil pada silinder nomor 5.',
      },
      {
        id: 'P17',
        name: 'Ignition Coil No. 6 Rusak',
        desc: 'Koil silinder 6 lemah atau mati.',
        solusi: 'Ganti Ignition Coil pada silinder nomor 6.',
      },
      {
        id: 'P18',
        name: 'Fuel Pump Lemah',
        desc: 'Tekanan bensin dari tangki kurang kuat.',
        solusi: 'Cek tekanan bensin (pressure gauge). Jika rendah, ganti Fuel Pump (Rotax).',
      },
      {
        id: 'P19',
        name: 'Filter Bensin Kotor',
        desc: 'Aliran bensin terhambat kotoran di filter.',
        solusi: 'Ganti Filter Bensin (Fuel Filter). Posisi biasanya di kolong mobil sebelah kiri.',
      },
      {
        id: 'P20',
        name: 'Selang Bensin Bocor',
        desc: 'Tekanan bensin drop karena ada kebocoran di jalur selang.',
        solusi: 'Ganti selang bensin yang bocor/getas. Gunakan klem yang kuat.',
      },
      {
        id: 'P21',
        name: 'Throttle Valve Kotor',
        desc: 'Kupu-kupu gas lengket karena kerak karbon.',
        solusi: 'Bersihkan Throttle Body/Valve menggunakan cleaner sampai bersih.',
      },
      {
        id: 'P22',
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
      ['G01', 'P01', 0.6], // RPM Drop
      ['G02', 'P01', 0.8], // Drop pas AC nyala
      ['G03', 'P01', 0.6], // Deletarate AC

      // P02: ICV Rusak (Bedanya ada G04: Sudah dibersihkan tetap error)
      ['G01', 'P02', 0.6],
      ['G02', 'P02', 0.6],
      ['G03', 'P02', 0.6],
      ['G04', 'P02', 1.0], // KEY SYMPTOM: Udah dibersihin tetep error = Rusak

      // P03: Selang AF Kotor
      ['G01', 'P03', 0.4],
      ['G05', 'P03', 0.6],
      ['G06', 'P03', 0.6], // Tenaga hilang tanjakan
      ['G07', 'P03', 0.6], // Loss power
      ['G08', 'P03', 0.6], // Asap hitam

      // P04: Selang AF Rusak (Ada G09: Fisik rusak)
      ['G01', 'P04', 0.4],
      ['G05', 'P04', 0.6],
      ['G06', 'P04', 0.6],
      ['G07', 'P04', 0.6],
      ['G08', 'P04', 0.6],
      ['G09', 'P04', 1.0], // KEY SYMPTOM: Fisik selang pecah

      // P05: Air Flow Rusak (Ada G10: Fisik bersih tapi error)
      ['G01', 'P05', 0.4],
      ['G05', 'P05', 0.6],
      ['G06', 'P05', 0.6],
      ['G07', 'P05', 0.6],
      ['G08', 'P05', 0.6],
      ['G10', 'P05', 1.0], // KEY SYMPTOM

      // P06 - P11: Busi Rusak (Silinder 1-6)
      ['G01', 'P06', 0.4],
      ['G11', 'P06', 0.8], // Pincang/Mbrebet
      ['G13', 'P06', 1.0], // Cabut kabel no 1 ga berubah = Busi/Koil 1 kena
      
      ['G01', 'P07', 0.4], ['G11', 'P07', 0.8], ['G14', 'P07', 1.0], // Cyl 2
      ['G01', 'P08', 0.4], ['G11', 'P08', 0.8], ['G15', 'P08', 1.0], // Cyl 3
      ['G01', 'P09', 0.4], ['G11', 'P09', 0.8], ['G16', 'P09', 1.0], // Cyl 4
      ['G01', 'P10', 0.4], ['G11', 'P10', 0.8], ['G12', 'P10', 0.2], ['G17', 'P10', 1.0], // Cyl 5
      ['G01', 'P11', 0.4], ['G11', 'P11', 0.8], ['G12', 'P11', 0.2], ['G18', 'P11', 1.0], // Cyl 6

      // P12 - P17: Koil Rusak (Pembeda dengan busi: Masalah PINDAH saat ditukar)
      ['G01', 'P12', 0.4], ['G11', 'P12', 0.8], ['G13', 'P12', 0.8], ['G19', 'P12', 1.0], // Koil 1
      ['G01', 'P13', 0.4], ['G11', 'P13', 0.8], ['G14', 'P13', 0.8], ['G20', 'P13', 1.0], // Koil 2
      ['G01', 'P14', 0.4], ['G11', 'P14', 0.8], ['G15', 'P14', 0.8], ['G21', 'P14', 1.0], // Koil 3
      ['G01', 'P15', 0.4], ['G11', 'P15', 0.8], ['G16', 'P15', 0.8], ['G22', 'P15', 1.0], // Koil 4
      ['G01', 'P16', 0.4], ['G11', 'P16', 0.8], ['G17', 'P16', 0.8], ['G23', 'P16', 1.0], // Koil 5
      ['G01', 'P17', 0.4], ['G11', 'P17', 0.8], ['G18', 'P17', 0.8], ['G24', 'P17', 1.0], // Koil 6

      // P18: Fuel Pump
      ['G25', 'P18', 0.6], // RPM nyangkut akselerasi
      ['G26', 'P18', 0.8], // Nyangkut putaran tinggi
      ['G27', 'P18', 0.8], // Ada yang menahan

      // P19: Filter Bensin (Ada G28: Fisik tersumbat)
      ['G25', 'P19', 0.6],
      ['G26', 'P19', 0.6],
      ['G27', 'P19', 0.6],
      ['G28', 'P19', 1.0], // KEY SYMPTOM: Cek fisik bensin ga keluar

      // P20: Selang Bensin (Ada G29: Bocor)
      ['G25', 'P20', 0.6],
      ['G26', 'P20', 0.6],
      ['G27', 'P20', 0.6],
      ['G29', 'P20', 1.0], // KEY SYMPTOM: Bau bensin/netes

      // P21: Throttle Valve Kotor
      ['G30', 'P21', 0.8], // RPM nyangkut deselerasi
      ['G31', 'P21', 0.8], // Naik mulus ga mau turun
      ['G32', 'P21', 0.8], // Tertahan putaran rendah

      // P22: Throttle Switch Rusak (Ada G33: Sudah bersih tetep error)
      ['G30', 'P22', 0.6],
      ['G31', 'P22', 0.6],
      ['G32', 'P22', 0.6],
      ['G33', 'P22', 1.0], // KEY SYMPTOM
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