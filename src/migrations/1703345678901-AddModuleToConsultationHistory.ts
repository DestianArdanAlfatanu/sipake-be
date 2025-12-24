import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddModuleToConsultationHistory1703345678901 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add module column to consultation_histories table
        await queryRunner.addColumn(
            'consultation_histories',
            new TableColumn({
                name: 'module',
                type: 'varchar',
                length: '50',
                default: "'engine'",
                isNullable: false,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove module column
        await queryRunner.dropColumn('consultation_histories', 'module');
    }
}
