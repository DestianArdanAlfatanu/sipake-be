/**
 * Quick script to create superadmin account
 * Run: node create-superadmin.js
 */

const bcrypt = require('bcrypt');
const { Client } = require('pg');

async function createSuperadmin() {
    console.log('🔧 Creating Superadmin Account...\n');

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
        const password = 'Admin@123';
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('✅ Password hashed\n');

        // Check if superadmin exists
        const checkResult = await client.query(
            'SELECT username FROM users WHERE username = $1',
            ['superadmin']
        );

        if (checkResult.rows.length > 0) {
            console.log('⚠️  Superadmin already exists. Updating password...\n');

            // Update password
            await client.query(
                'UPDATE users SET password = $1, role = $2, verified = $3 WHERE username = $4',
                [hashedPassword, 'SUPER_ADMIN', true, 'superadmin']
            );

            console.log('✅ Superadmin password updated!\n');
        } else {
            console.log('📝 Creating new superadmin account...\n');

            // Insert new superadmin
            await client.query(
                `INSERT INTO users (
          username, password, email, name, phone_number, 
          address, plate_number, profile_picture, verified, role
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
                [
                    'superadmin',
                    hashedPassword,
                    'admin@sipake.com',
                    'Super Administrator',
                    '081234567890',
                    'Jakarta, Indonesia',
                    'B1234ABC',
                    'default-admin.jpg',
                    true,
                    'SUPER_ADMIN'
                ]
            );

            console.log('✅ Superadmin account created!\n');
        }

        // Verify
        const verifyResult = await client.query(
            'SELECT username, email, name, role, verified FROM users WHERE username = $1',
            ['superadmin']
        );

        console.log('📋 Superadmin Account Details:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Username:', verifyResult.rows[0].username);
        console.log('Email:', verifyResult.rows[0].email);
        console.log('Name:', verifyResult.rows[0].name);
        console.log('Role:', verifyResult.rows[0].role);
        console.log('Verified:', verifyResult.rows[0].verified);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n🔐 Login Credentials:');
        console.log('Username: superadmin');
        console.log('Password: Admin@123');
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
createSuperadmin();
