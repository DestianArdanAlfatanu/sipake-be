import { DataSource } from 'typeorm';
import { User, UserRole } from '../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

/**
 * Admin Seeder
 * 
 * Creates default admin accounts:
 * 1. Super Admin - Full access to everything
 * 2. Expert (Om Rizal) - Can manage knowledge base
 * 
 * Run this seeder after running migrations
 */
export class AdminSeeder {
    public async run(dataSource: DataSource): Promise<void> {
        const userRepository = dataSource.getRepository(User);

        // Check if admin accounts already exist
        const existingSuperAdmin = await userRepository.findOne({
            where: { username: 'superadmin' },
        });

        const existingExpert = await userRepository.findOne({
            where: { username: 'expert_rizal' },
        });

        // Create Super Admin if doesn't exist
        if (!existingSuperAdmin) {
            const hashedPassword = await bcrypt.hash('Admin@123', 10);

            await userRepository.save({
                username: 'superadmin',
                password: hashedPassword,
                email: 'admin@sipake.com',
                name: 'Super Administrator',
                phoneNumber: '081234567890',
                address: 'Jakarta, Indonesia',
                plateNumber: 'B1234ABC',
                profilePicture: 'default-admin.jpg',
                verified: true,
                role: UserRole.SUPER_ADMIN,
                carSeries: null,
                carYear: null,
                engineCode: null,
            });

            console.log('✅ Super Admin created successfully');
            console.log('   Username: superadmin');
            console.log('   Password: Admin@123');
            console.log('   Role: SUPER_ADMIN');
        } else {
            console.log('ℹ️  Super Admin already exists, skipping...');
        }

        // Create Expert (Om Rizal) if doesn't exist
        if (!existingExpert) {
            const hashedPassword = await bcrypt.hash('Expert@123', 10);

            await userRepository.save({
                username: 'expert_rizal',
                password: hashedPassword,
                email: 'rizal@sipake.com',
                name: 'Om Rizal - BMW Expert',
                phoneNumber: '081234567891',
                address: 'New Jaya Motor, Bintaro Trade Center',
                plateNumber: 'B5678DEF',
                profilePicture: 'default-expert.jpg',
                verified: true,
                role: UserRole.EXPERT,
                carSeries: null,
                carYear: null,
                engineCode: null,
            });

            console.log('✅ Expert account created successfully');
            console.log('   Username: expert_rizal');
            console.log('   Password: Expert@123');
            console.log('   Role: EXPERT');
        } else {
            console.log('ℹ️  Expert account already exists, skipping...');
        }

        console.log('\n🎉 Admin seeder completed!');
        console.log('\n📝 Login Credentials:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('SUPER ADMIN:');
        console.log('  Username: superadmin');
        console.log('  Password: Admin@123');
        console.log('  Access: Full system access');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('EXPERT (Om Rizal):');
        console.log('  Username: expert_rizal');
        console.log('  Password: Expert@123');
        console.log('  Access: Knowledge base management');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
}
