import { TransactionType } from '@vm-finance/shared';
import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  type Relation,
} from 'typeorm';
import { Category } from './category.entity.js';
import { DebtTracker } from './debt-tracker.entity.js';
import { MonthlyBudget } from './monthly-budget.entity.js';
import { User } from './user.entity.js';

@Entity('transactions')
@Index('idx_transactions_user_id_occurred_on', ['userId', 'occurredOn'])
@Index('idx_transactions_budget_id_type', ['budgetId', 'type'])
@Check('chk_transactions_amount', '"amount" > 0')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  budgetId: string;

  @Column({ type: 'enum', enum: TransactionType, enumName: 'transaction_type' })
  type: TransactionType;

  @Column({ type: 'integer' })
  amount: number;

  @Column({ type: 'uuid', nullable: true })
  categoryId: string | null;

  @Column({ type: 'varchar' })
  detail: string;

  @Column({ type: 'date' })
  occurredOn: string;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  debtId: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: Relation<User>;

  @ManyToOne(() => MonthlyBudget, (budget) => budget.transactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'budget_id' })
  budget?: Relation<MonthlyBudget>;

  @ManyToOne(() => Category, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category?: Relation<Category> | null;

  @ManyToOne(() => DebtTracker, (debt) => debt.transactions, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'debt_id' })
  debt?: Relation<DebtTracker> | null;
}
