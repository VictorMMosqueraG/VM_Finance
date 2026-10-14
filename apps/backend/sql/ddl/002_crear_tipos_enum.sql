SET search_path TO vm_finance;

CREATE TYPE payment_status AS ENUM (
  'PENDING_PAYMENT',
  'PAID'
);

CREATE TYPE transaction_type AS ENUM (
  'FIXED_EXPENSE',
  'VARIABLE_SALARY',
  'FROM_SAVINGS',
  'ADD_SAVINGS',
  'EXTRA_INCOME'
);

CREATE TYPE notification_channel AS ENUM (
  'PUSH',
  'EMAIL'
);
