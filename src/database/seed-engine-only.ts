/**
 * Script untuk seed data engine saja (problems, symptoms, rules)
 * Aman dijalankan meski data suspension sudah ada
 * Menggunakan UPSERT (INSERT or UPDATE) berdasarkan PK
 */
import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../typeorm.config';
import { EngineSeeder } from './seeders/engine.seeder';

async function run() {
    const dataSource = new DataSource(dataSourceOptions);
    await dataSource.initialize();
    console.log('📦 Database connected - seeding ENGINE only...');

    const engineSeeder = new EngineSeeder(dataSource);
    await engineSeeder.run();

    await dataSource.destroy();
    console.log('✅ Engine seed completed & DB connection closed.');
}

run().catch((e) => {
    console.error('❌ Engine seed failed:', e);
    process.exit(1);
});
