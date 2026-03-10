/**
 * Script untuk seed ulang data mobil (series, tahun, kode mesin)
 * PERINGATAN: Akan menghapus data lama dan insert ulang
 */
import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../typeorm.config';
import { CarDataSeeder } from './seeders/car-data.seeder';

async function run() {
    const dataSource = new DataSource(dataSourceOptions);
    await dataSource.initialize();
    console.log('📦 Database connected - seeding CAR DATA only...');

    const carDataSeeder = new CarDataSeeder(dataSource);
    await carDataSeeder.run();

    await dataSource.destroy();
    console.log('✅ Car data seed completed & DB connection closed.');
}

run().catch((e) => {
    console.error('❌ Car data seed failed:', e);
    process.exit(1);
});
