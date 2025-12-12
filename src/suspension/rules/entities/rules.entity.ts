import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { SuspensionProblem } from '../../problems/entities/problems.entity';
import { SuspensionSymptom } from '../../symptoms/entities/symptoms.entity';

@Entity('suspension_rules')
export class SuspensionRule {
@PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  code: string;

  // Hubungkan ke Problem (ManyToOne)
  @ManyToOne(() => SuspensionProblem, (problem) => problem.rules, { eager: true })
  @JoinColumn({ name: 'problem_id' })
  problem: SuspensionProblem;

  // Hubungkan ke Symptom (ManyToOne)
  @ManyToOne(() => SuspensionSymptom, (symptom) => symptom.rules, { eager: true })
  @JoinColumn({ name: 'symptom_id' })
  symptom: SuspensionSymptom;

  // Tempat simpan nilai keyakinan Om Rizal (0.0 s.d 1.0)
  @Column({ type: 'float', name: 'cf_pakar' })
  cfPakar: number;
}
