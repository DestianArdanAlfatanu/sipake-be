import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { SuspensionRule } from '../../rules/entities/rules.entity';

@Entity('suspension_symptoms')
export class SuspensionSymptom {
  @PrimaryColumn({ type: 'varchar', length: 10 })
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  media?: string;

  @OneToMany(() => SuspensionRule, (r) => r.symptom)
  rules?: SuspensionRule[];
}
