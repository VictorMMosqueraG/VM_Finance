import { Category } from './category.entity.js';
import { DebtTracker } from './debt-tracker.entity.js';
import { IncomeSource } from './income-source.entity.js';
import { InviteCode } from './invite-code.entity.js';
import { MonthlyBudget } from './monthly-budget.entity.js';
import { MonthlyIncome } from './monthly-income.entity.js';
import { PaymentInstance } from './payment-instance.entity.js';
import { PaymentReminder } from './payment-reminder.entity.js';
import { PushSubscription } from './push-subscription.entity.js';
import { RefreshToken } from './refresh-token.entity.js';
import { ReminderLog } from './reminder-log.entity.js';
import { Transaction } from './transaction.entity.js';
import { UserSettings } from './user-settings.entity.js';
import { User } from './user.entity.js';

export {
  Category,
  DebtTracker,
  IncomeSource,
  InviteCode,
  MonthlyBudget,
  MonthlyIncome,
  PaymentInstance,
  PaymentReminder,
  PushSubscription,
  RefreshToken,
  ReminderLog,
  Transaction,
  User,
  UserSettings,
};

export const ENTITIES = [
  User,
  RefreshToken,
  InviteCode,
  UserSettings,
  IncomeSource,
  MonthlyBudget,
  MonthlyIncome,
  Category,
  Transaction,
  DebtTracker,
  PaymentReminder,
  PaymentInstance,
  ReminderLog,
  PushSubscription,
];
