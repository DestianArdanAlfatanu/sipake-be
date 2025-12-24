/**
 * Quick script to create expert account (Om Rizal)
 * Run: node create-expert.js
 */

const bcrypt = require('bcrypt');
const { Client } = require('pg');

async function createExpert() {
    console.log('🔧 Creating Expert Account (Om Rizal)...\n');

    // Database connection
    const client = new Client({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'sipake',
    });

    try {
        await client.connect();
        console.log('✅ Connected to database\n');

        // Generate password hash
        const password = 'Expert@123';
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('✅ Password hashed\n');

        // Check if expert exists
        const checkResult = await client.query(
            'SELECT username FROM users WHERE username = $1',
            ['expert_rizal']
        );

        if (checkResult.rows.length > 0) {
            console.log('⚠️  Expert account already exists. Updating password...\n');

            // Update password
            await client.query(
                'UPDATE users SET password = $1, role = $2, verified = $3 WHERE username = $4',
                [hashedPassword, 'EXPERT', true, 'expert_rizal']
            );

            console.log('✅ Expert password updated!\n');
        } else {
            console.log('📝 Creating new expert account...\n');

            // Insert new expert
            await client.query(
                `INSERT INTO users (
          username, password, email, name, phone_number, 
          address, plate_number, profile_picture, verified, role
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
                [
                    'expert_rizal',
                    hashedPassword,
                    'expert@sipake.com',
                    'Om Rizal - BMW Expert',
                    '081234567891',
                    'New Jaya Motor, Bintaro Trade Center',
                    'B5678DEF',
                    'default-expert.jpg',
                    true,
                    'EXPERT'
                ]
            );

            console.log('✅ Expert account created!\n');
        }

        // Verify
        const verifyResult = await client.query(
            'SELECT username, email, name, role, verified FROM users WHERE username = $1',
            ['expert_rizal']
        );

        console.log('📋 Expert Account Details:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Username:', verifyResult.rows[0].username);
        console.log('Email:', verifyResult.rows[0].email);
        console.log('Name:', verifyResult.rows[0].name);
        console.log('Role:', verifyResult.rows[0].role);
        console.log('Verified:', verifyResult.rows[0].verified);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n🔐 Login Credentials:');
        console.log('Username: expert_rizal');
        console.log('Password: Expert@123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        await client.end();
        console.log('✅ Database connection closed\n');
    }
}

// Run
createExpert();
