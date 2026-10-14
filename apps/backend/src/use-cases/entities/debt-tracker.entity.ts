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
import { Transaction } from './transaction.entity.js';
import { User } from './user.entity.js';

@Entity('debts')
@Unique('uq_debts_user_id_name', ['userId', 'name'])
@Check('chk_debts_total_amount', '"total_amount" > 0')
export class DebtTracker {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'integer' })
  totalAmount: number;

  @Column({ type: 'boolean', default: false })
  isClosed: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: Relation<User>;

  @OneToMany(() => Transaction, (transaction) => transaction.debt)
  transactions?: Relation<Transaction[]>;
}
