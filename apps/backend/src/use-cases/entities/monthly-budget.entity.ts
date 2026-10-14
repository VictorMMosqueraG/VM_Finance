import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  type Relation,
} from 'typeorm';
import { MonthlyIncome } from './monthly-income.entity.js';
import { PaymentInstance } from './payment-instance.entity.js';
import { Transaction } from './transaction.entity.js';
import { User } from './user.entity.js';

@Entity('monthly_budgets')
@Unique('uq_monthly_budgets_user_id_period', ['userId', 'period'])
@Check('chk_monthly_budgets_period', `"period" ~ '^[0-9]{4}-(0[1-9]|1[0-2])$'`)
export class MonthlyBudget {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'char', length: 7 })
  period: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: Relation<User>;

  @OneToMany(() => MonthlyIncome, (income) => income.budget)
  incomes?: Relation<MonthlyIncome[]>;

  @OneToMany(() => Transaction, (transaction) => transaction.budget)
  transactions?: Relation<Transaction[]>;

  @OneToMany(() => PaymentInstance, (instance) => instance.budget)
  paymentInstances?: Relation<PaymentInstance[]>;
}
