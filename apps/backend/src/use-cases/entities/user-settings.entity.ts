import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
  type Relation,
} from 'typeorm';
import { APP_TIMEZONE } from '@vm-finance/shared';
import { User } from './user.entity.js';

@Entity('user_settings')
export class UserSettings {
  @PrimaryColumn({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', default: APP_TIMEZONE })
  timezone: string;

  @Column({ type: 'boolean', default: true })
  pushEnabled: boolean;

  @Column({ type: 'boolean', default: false })
  emailEnabled: boolean;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: Relation<User>;
}
