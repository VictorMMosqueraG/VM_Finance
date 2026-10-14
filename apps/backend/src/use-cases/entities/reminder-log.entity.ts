import { NotificationChannel } from '@vm-finance/shared';
import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  type Relation,
} from 'typeorm';
import { PaymentInstance } from './payment-instance.entity.js';

@Entity('reminder_logs')
@Unique('uq_reminder_logs_instance_id_sent_on_channel_offset_days', [
  'instanceId',
  'sentOn',
  'channel',
  'offsetDays',
])
@Check('chk_reminder_logs_offset_days', '"offset_days" >= 0')
export class ReminderLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  instanceId: string;

  @Column({ type: 'enum', enum: NotificationChannel, enumName: 'notification_channel' })
  channel: NotificationChannel;

  @Column({ type: 'integer' })
  offsetDays: number;

  @Column({ type: 'date' })
  sentOn: string;

  @CreateDateColumn({ type: 'timestamptz' })
  sentAt: Date;

  @ManyToOne(() => PaymentInstance, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'instance_id' })
  instance?: Relation<PaymentInstance>;
}
