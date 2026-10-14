SET search_path TO vm_finance;

CREATE TABLE users (
  id             uuid NOT NULL DEFAULT gen_random_uuid(),
  email          varchar NOT NULL,
  password_hash  varchar NOT NULL,
  name           varchar NOT NULL,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);
