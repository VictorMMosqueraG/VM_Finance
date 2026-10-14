SET search_path TO vm_finance;

CREATE TABLE monthly_incomes (
  id                uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id           uuid NOT NULL,
  budget_id         uuid NOT NULL,
  income_source_id  uuid,
  name              varchar NOT NULL,
  amount            integer NOT NULL,
  savings_percent   integer NOT NULL,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);
