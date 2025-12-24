import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddRoleToUsers1703346000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add role column to users table
        await queryRunner.addColumn(
            'users',
            new TableColumn({
                name: 'role',
                type: 'varchar',
                length: '20',
                default: "'USER'",
                isNullable: false,
            }),
        );

        // Create index on role for faster queries
        await queryRunner.query(
            `CREATE INDEX "IDX_users_role" ON "users" ("role")`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop index
        await queryRunner.query(`DROP INDEX "IDX_users_role"`);

        // Remove role column
        await queryRunner.dropColumn('users', 'role');
    }
}
