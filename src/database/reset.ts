import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Database Reset Script
 * 
 * This script will:
 * 1. Drop all existing tables
 * 2. Recreate tables (via synchronize)
 * 3. Run all seeders
 * 
 * ⚠️ WARNING: This will DELETE ALL DATA!
 * 
 * Usage:
 * npm run db:reset-full
 */
async function resetDatabase() {
    console.log('🔄 Starting Database Reset...\n');

    // Create DataSource connection
    const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 5432,
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_DATABASE || 'sipake',
        entities: ['src/**/*.entity.ts'],
        synchronize: false, // We'll handle this manually
        logging: true,
    });

    try {
        // Initialize connection
        await dataSource.initialize();
        console.log('✅ Database connection established\n');

        // Drop all tables
        console.log('🗑️  Dropping all tables...');
        await dataSource.query('DROP SCHEMA public CASCADE');
        await dataSource.query('CREATE SCHEMA public');
        await dataSource.query('GRANT ALL ON SCHEMA public TO postgres');
        await dataSource.query('GRANT ALL ON SCHEMA public TO public');
        console.log('✅ All tables dropped\n');

        // Close and reconnect with synchronize: true
        await dataSource.destroy();

        const syncDataSource = new DataSource({
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT) || 5432,
            username: process.env.DB_USERNAME || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            database: process.env.DB_DATABASE || 'sipake',
            entities: ['src/**/*.entity.ts'],
            synchronize: true, // Auto-create tables
            logging: false,
        });

        await syncDataSource.initialize();
        console.log('✅ Tables recreated\n');
        await syncDataSource.destroy();

        console.log('✅ Database reset completed successfully!');
        console.log('\n📝 Next step: Run "npm run seed" to populate data\n');

    } catch (error) {
        console.error('❌ Error resetting database:', error);
        process.exit(1);
    }
}

// Run reset
resetDatabase();
