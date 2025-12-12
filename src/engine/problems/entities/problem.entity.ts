import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { Solution } from '../../solutions/entities/solution.entity';
import { Rule } from '../../rules/entities/rule.entity';

@Entity({ name: 'problems' })
export class Problem {
  @PrimaryColumn({ type: 'varchar', length: 10 })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  pict: string;

  // PROBLEM yang memegang kunci ke Solution
  // Cascade: true artinya kalau Problem disimpan, Solution di dalamnya ikut tersimpan
  @OneToOne(() => Solution, (solution) => solution.problem, { cascade: true, eager: true })
  @JoinColumn() 
  solution: Solution;

  @OneToMany(() => Rule, (rule) => rule.problem)
  rules: Rule[];
}