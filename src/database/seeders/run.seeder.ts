import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../../typeorm.config';
import { SuspensionSeeder } from '../seeders/suspension.seeder';

async function run() {
  const dataSource = new DataSource(dataSourceOptions);

  await dataSource.initialize();
  console.log('📦 Database connected.');

  const seeder = new SuspensionSeeder(dataSource);
  await seeder.run();

  await dataSource.destroy();
  console.log('🌱 Seed completed & DB connection closed.');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
