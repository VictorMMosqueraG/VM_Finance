SET search_path TO vm_finance;

CREATE TABLE invite_codes (
  id             uuid NOT NULL DEFAULT gen_random_uuid(),
  code           varchar NOT NULL,
  created_by_id  uuid,
  used_by_id     uuid,
  used_at        timestamptz,
  expires_at     timestamptz,
  created_at     timestamptz NOT NULL DEFAULT now()
);
