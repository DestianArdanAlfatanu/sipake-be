import { CarYear } from '../../car/car-years/entities/car-year.entity';
import { EngineCode } from '../../engine/engine-codes/entities/engine-code.entity';
import { CarSeries } from '../../car/car-series/entities/car-series.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';

// User Role Enum for RBAC
export enum UserRole {
  USER = 'USER',              // Regular user - can only consult
  EXPERT = 'EXPERT',          // Expert - can manage knowledge base
  SUPER_ADMIN = 'SUPER_ADMIN', // Super Admin - full access
}

@Entity({ name: 'users' })
export class User {
  @Column({ type: 'varchar', primary: true })
  username: string;

  @Column({ type: 'varchar', length: 60 })
  password: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 128 })
  name: string;

  @Column({ type: 'varchar', length: 32, name: 'phone_number' })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @ManyToOne(() => CarSeries, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'car_series_id', referencedColumnName: 'series_id' })
  carSeries: CarSeries;

  @ManyToOne(() => CarYear, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'car_year', referencedColumnName: 'year' })
  carYear: CarYear;

  @ManyToOne(() => EngineCode, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'engine_code', referencedColumnName: 'code' })
  engineCode: EngineCode;

  @Column({ type: 'varchar', length: 10, name: 'plate_number' })
  plateNumber: string;

  @Column({ type: 'varchar', length: 255, name: 'profile_picture' })
  profilePicture: string;

  @Column({ type: 'boolean', default: false })
  verified: boolean;

  // Role for RBAC
  @Column({
    type: 'varchar',
    length: 20,
    default: UserRole.USER,
  })
  role: UserRole;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

