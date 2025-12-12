import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Symptom } from '../../symptoms/entities/symptom.entity';
import { Problem } from '../../problems/entities/problem.entity';

@Entity({ name: 'rules' })
export class Rule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  code: string;

  // Nilai Keyakinan Pakar (0.0 - 1.0)
  @Column({ type: 'float', name: 'cf_pakar', default: 0.8 })
  cfPakar: number;

  @ManyToOne(() => Problem, (problem) => problem.rules, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'problem_id' })
  problem: Problem;

  @ManyToOne(() => Symptom, (symptom) => symptom.rules, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'symptom_id' })
  symptom: Symptom;
}