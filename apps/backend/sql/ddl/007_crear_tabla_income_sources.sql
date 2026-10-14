SET search_path TO vm_finance;

CREATE TABLE income_sources (
  id               uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id          uuid NOT NULL,
  name             varchar NOT NULL,
  default_amount   integer NOT NULL,
  savings_percent  integer NOT NULL,
  is_active        boolean NOT NULL DEFAULT true,
  sort_order       integer NOT NULL DEFAULT '0',
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);
