SET search_path TO vm_finance;

CREATE TABLE refresh_tokens (
  id              uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL,
  token_hash      varchar NOT NULL,
  expires_at      timestamptz NOT NULL,
  revoked_at      timestamptz,
  replaced_by_id  uuid,
  user_agent      varchar,
  created_at      timestamptz NOT NULL DEFAULT now()
);
