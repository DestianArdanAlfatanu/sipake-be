import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Problem } from '../../problems/entities/problem.entity';

@Entity({ name: 'solutions' })
export class Solution {
  // Ganti @PrimaryColumn menjadi @PrimaryGeneratedColumn agar ID otomatis dibuat (1, 2, 3...)
  @PrimaryGeneratedColumn()
  id: number;

  // Pastikan nama property ini 'solution' (bukan 'name') agar cocok dengan Seeder
  @Column({ type: 'text' })
  solution: string;

  // Relasi balik ke Problem
  @OneToOne(() => Problem, (problem) => problem.solution)
  problem: Problem;
}