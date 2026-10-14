SET search_path TO vm_finance;

CREATE TABLE user_settings (
  user_id        uuid NOT NULL,
  timezone       varchar NOT NULL DEFAULT 'America/Bogota',
  push_enabled   boolean NOT NULL DEFAULT true,
  email_enabled  boolean NOT NULL DEFAULT false,
  updated_at     timestamptz NOT NULL DEFAULT now()
);
