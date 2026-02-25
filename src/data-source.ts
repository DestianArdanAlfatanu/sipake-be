import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * TypeORM DataSource Configuration
 * 
 * This file is used by TypeORM CLI for running migrations.
 * 
 * Usage:
 * - npm run migration:run
 * - npm run migration:revert
 * - npm run migration:generate -- -n MigrationName
 */
export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'sipake',
    entities: ['src/**/*.entity.ts'],
    migrations: ['src/migrations/*.ts'],
    synchronize: false,
    logging: true,
});
