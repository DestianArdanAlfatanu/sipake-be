import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { SuspensionProblem } from '../../problems/entities/problems.entity';

@Entity('suspension_solutions')
export class SuspensionSolution {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  solution: string;

  @OneToOne(() => SuspensionProblem, (p) => p.solution)
  problem?: SuspensionProblem;
}
