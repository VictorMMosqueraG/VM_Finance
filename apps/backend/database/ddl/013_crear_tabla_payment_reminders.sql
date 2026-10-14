SET search_path TO vm_finance;

CREATE TABLE payment_reminders (
  id                       uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id                  uuid NOT NULL,
  name                     varchar NOT NULL,
  amount                   integer NOT NULL,
  due_day                  integer NOT NULL,
  notify_days_before       integer[] NOT NULL DEFAULT '{3,1,0}',
  category_id              uuid,
  auto_create_transaction  boolean NOT NULL DEFAULT true,
  is_active                boolean NOT NULL DEFAULT true,
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now()
);
