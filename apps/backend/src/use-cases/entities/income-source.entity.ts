import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  type Relation,
} from 'typeorm';
import { User } from './user.entity.js';

@Entity('income_sources')
@Unique('uq_income_sources_user_id_name', ['userId', 'name'])
@Check('chk_income_sources_default_amount', '"default_amount" >= 0')
@Check('chk_income_sources_savings_percent', '"savings_percent" BETWEEN 0 AND 100')
export class IncomeSource {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'integer' })
  defaultAmount: number;

  @Column({ type: 'integer' })
  savingsPercent: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'integer', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: Relation<User>;
}
