SET search_path TO vm_finance;

CREATE TABLE transactions (
  id           uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL,
  budget_id    uuid NOT NULL,
  type         transaction_type NOT NULL,
  amount       integer NOT NULL,
  category_id  uuid,
  detail       varchar NOT NULL,
  occurred_on  date NOT NULL,
  debt_id      uuid,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);
