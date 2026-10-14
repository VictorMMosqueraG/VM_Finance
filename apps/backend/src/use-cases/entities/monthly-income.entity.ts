import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  type Relation,
} from 'typeorm';
import { IncomeSource } from './income-source.entity.js';
import { MonthlyBudget } from './monthly-budget.entity.js';
import { User } from './user.entity.js';

@Entity('monthly_incomes')
@Unique('uq_monthly_incomes_budget_id_income_source_id', ['budgetId', 'incomeSourceId'])
@Check('chk_monthly_incomes_amount', '"amount" >= 0')
@Check('chk_monthly_incomes_savings_percent', '"savings_percent" BETWEEN 0 AND 100')
export class MonthlyIncome {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  budgetId: string;

  @Column({ type: 'uuid', nullable: true })
  incomeSourceId: string | null;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'integer' })
  amount: number;

  @Column({ type: 'integer' })
  savingsPercent: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: Relation<User>;

  @ManyToOne(() => MonthlyBudget, (budget) => budget.incomes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'budget_id' })
  budget?: Relation<MonthlyBudget>;

  @ManyToOne(() => IncomeSource, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'income_source_id' })
  incomeSource?: Relation<IncomeSource> | null;
}
