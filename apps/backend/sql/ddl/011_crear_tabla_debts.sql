SET search_path TO vm_finance;

CREATE TABLE debts (
  id            uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL,
  name          varchar NOT NULL,
  total_amount  integer NOT NULL,
  is_closed     boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
