import { PaymentStatus } from '@vm-finance/shared';
import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  type Relation,
} from 'typeorm';
import { MonthlyBudget } from './monthly-budget.entity.js';
import { PaymentReminder } from './payment-reminder.entity.js';
import { Transaction } from './transaction.entity.js';
import { User } from './user.entity.js';

@Entity('payment_instances')
@Unique('uq_payment_instances_reminder_id_period', ['reminderId', 'period'])
@Index('idx_payment_instances_user_id_status_due_date', ['userId', 'status', 'dueDate'])
@Check('chk_payment_instances_amount', '"amount" >= 0')
@Check('chk_payment_instances_period', `"period" ~ '^[0-9]{4}-(0[1-9]|1[0-2])$'`)
@Check('chk_payment_instances_paid_at', `"status" <> 'PAID' OR "paid_at" IS NOT NULL`)
export class PaymentInstance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  reminderId: string;

  @Index()
  @Column({ type: 'uuid' })
  budgetId: string;

  @Column({ type: 'char', length: 7 })
  period: string;

  @Column({ type: 'integer' })
  amount: number;

  @Column({ type: 'date' })
  dueDate: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    enumName: 'payment_status',
    default: PaymentStatus.PENDING_PAYMENT,
  })
  status: PaymentStatus;

  @Column({ type: 'timestamptz', nullable: true })
  paidAt: Date | null;

  @Column({ type: 'uuid', nullable: true })
  transactionId: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: Relation<User>;

  @ManyToOne(() => PaymentReminder, (reminder) => reminder.instances, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reminder_id' })
  reminder?: Relation<PaymentReminder>;

  @ManyToOne(() => MonthlyBudget, (budget) => budget.paymentInstances, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'budget_id' })
  budget?: Relation<MonthlyBudget>;

  @OneToOne(() => Transaction, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'transaction_id' })
  transaction?: Relation<Transaction> | null;
}
