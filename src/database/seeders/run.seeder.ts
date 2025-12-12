import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../../typeorm.config';
import { SuspensionSeeder } from './suspension.seeder';
import { EngineSeeder } from './engine.seeder'; // <--- Import ini

async function run() {
  const dataSource = new DataSource(dataSourceOptions);

  await dataSource.initialize();
  console.log('📦 Database connected.');

  // Jalankan Suspension
  const suspensionSeeder = new SuspensionSeeder(dataSource);
  await suspensionSeeder.run();

  // Jalankan Engine
  const engineSeeder = new EngineSeeder(dataSource); // <--- Inisialisasi
  await engineSeeder.run(); // <--- Eksekusi

  await dataSource.destroy();
  console.log('🌱 Seed completed & DB connection closed.');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});