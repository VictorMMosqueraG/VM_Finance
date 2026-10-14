SET search_path TO vm_finance;

CREATE TABLE payment_instances (
  id              uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL,
  reminder_id     uuid NOT NULL,
  budget_id       uuid NOT NULL,
  period          char(7) NOT NULL,
  amount          integer NOT NULL,
  due_date        date NOT NULL,
  status          payment_status NOT NULL DEFAULT 'PENDING_PAYMENT',
  paid_at         timestamptz,
  transaction_id  uuid,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);
