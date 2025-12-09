import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { SuspensionProblem } from '../../problems/entities/problems.entity';
import { SuspensionSymptom } from '../../symptoms/entities/symptoms.entity';

@Entity('suspension_rules')
export class SuspensionRule {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SuspensionProblem, (p) => p.rules, { eager: true })
  @JoinColumn({ name: 'problem_id' })
  problem: SuspensionProblem;

  @ManyToOne(() => SuspensionSymptom, (s) => s.rules, { eager: true })
  @JoinColumn({ name: 'symptom_id' })
  symptom: SuspensionSymptom;

  @Column('float', { default: 0.8 })
  expertCf: number;
}
