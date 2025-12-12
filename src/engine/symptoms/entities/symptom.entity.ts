import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Rule } from '../../rules/entities/rule.entity';

@Entity({ name: 'symptoms' })
export class Symptom {
  @PrimaryColumn({ type: 'varchar', length: 4 })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string; // Sesuaikan (misal: nama_gejala)

  @OneToMany(() => Rule, (rule) => rule.symptom)
  rules: Rule[];
}