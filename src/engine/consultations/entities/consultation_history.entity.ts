import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../../users/entities/user.entity';

@Entity({ name: 'consultation_histories' })
export class ConsultationHistory {
  @Column({ primary: true, generated: 'increment' })
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

  @Column({ type: 'varchar', length: 10, nullable: true })
  problem_id: string | null;

  @CreateDateColumn()
  consultation_date: Date;

  @Column({ type: 'varchar', length: 255 })
  status: string;

  @Column({ type: 'varchar', length: 50, default: 'engine' })
  module: string; // 'engine' or 'suspension'
}
