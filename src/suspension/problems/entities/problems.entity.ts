import { Entity, PrimaryColumn, Column, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { SuspensionSolution } from '../../solutions/entities/solutions.entity';
import { SuspensionRule } from '../../rules/entities/rules.entity';

@Entity('suspension_problems')
export class SuspensionProblem {
  @PrimaryColumn({ type: 'varchar', length: 10 })
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  pict?: string;

  @OneToOne(() => SuspensionSolution, (s) => s.problem, { cascade: true })
  @JoinColumn()
  solution?: SuspensionSolution;

  @OneToMany(() => SuspensionRule, (r) => r.problem)
  rules?: SuspensionRule[];
}
