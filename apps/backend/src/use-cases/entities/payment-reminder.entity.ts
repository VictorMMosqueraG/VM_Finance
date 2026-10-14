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
import { Category } from './category.entity.js';
import { PaymentInstance } from './payment-instance.entity.js';
import { User } from './user.entity.js';

@Entity('payment_reminders')
@Unique('uq_payment_reminders_user_id_name', ['userId', 'name'])
@Check('chk_payment_reminders_amount', '"amount" >= 0')
@Check('chk_payment_reminders_due_day', '"due_day" BETWEEN 1 AND 31')
@Check('chk_payment_reminders_notify_days', '0 <= ALL ("notify_days_before")')
export class PaymentReminder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'integer' })
  amount: number;

  @Column({ type: 'integer' })
  dueDay: number;

  @Column({ type: 'integer', array: true, default: () => "'{3,1,0}'" })
  notifyDaysBefore: number[];

  @Column({ type: 'uuid', nullable: true })
  categoryId: string | null;

  @Column({ type: 'boolean', default: true })
  autoCreateTransaction: boolean;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: Relation<User>;

  @ManyToOne(() => Category, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category?: Relation<Category> | null;

  @OneToMany(() => PaymentInstance, (instance) => instance.reminder)
  instances?: Relation<PaymentInstance[]>;
}
