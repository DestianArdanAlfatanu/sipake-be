import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../../typeorm.config';
import { SuspensionSeeder } from './suspension.seeder';
import { EngineSeeder } from './engine.seeder';
import { CarDataSeeder } from '../seeders/car-data.seeder';

async function run() {
  const dataSource = new DataSource(dataSourceOptions);

  await dataSource.initialize();
  console.log('📦 Database connected.');

  // Run Car Data Seeder first (car series, years, engine codes)
  const carDataSeeder = new CarDataSeeder(dataSource);
  await carDataSeeder.run();

  // Run Suspension Seeder
  const suspensionSeeder = new SuspensionSeeder(dataSource);
  await suspensionSeeder.run();

  // Run Engine Seeder
  const engineSeeder = new EngineSeeder(dataSource);
  await engineSeeder.run();

  await dataSource.destroy();
  console.log('🌱 Seed completed & DB connection closed.');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});