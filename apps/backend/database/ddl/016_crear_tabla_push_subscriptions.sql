SET search_path TO vm_finance;

CREATE TABLE push_subscriptions (
  id            uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL,
  endpoint      text NOT NULL,
  p256dh        varchar NOT NULL,
  auth          varchar NOT NULL,
  user_agent    varchar,
  created_at    timestamptz NOT NULL DEFAULT now(),
  last_used_at  timestamptz
);
