import { DataSource } from 'typeorm';
import { AdminSeeder } from './seeders/admin.seeder';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Seeder Runner
 * 
 * This script runs all seeders in order.
 * 
 * Usage:
 * npm run seed
 */
async function runSeeders() {
    console.log('🌱 Starting database seeding...\n');

    // Create DataSource connection
    const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 5432,
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_DATABASE || 'sipake',
        entities: ['src/**/*.entity.ts'],
        synchronize: false,
    });

    try {
        // Initialize connection
        await dataSource.initialize();
        console.log('✅ Database connection established\n');

        // Run Admin Seeder
        console.log('Running Admin Seeder...');
        const adminSeeder = new AdminSeeder();
        await adminSeeder.run(dataSource);

        console.log('\n✅ All seeders completed successfully!');
    } catch (error) {
        console.error('❌ Error running seeders:', error);
        process.exit(1);
    } finally {
        // Close connection
        await dataSource.destroy();
        console.log('\n🔌 Database connection closed');
    }
}

// Run seeders
runSeeders();
