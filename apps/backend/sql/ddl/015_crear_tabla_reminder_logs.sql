SET search_path TO vm_finance;

CREATE TABLE reminder_logs (
  id           uuid NOT NULL DEFAULT gen_random_uuid(),
  instance_id  uuid NOT NULL,
  channel      notification_channel NOT NULL,
  offset_days  integer NOT NULL,
  sent_on      date NOT NULL,
  sent_at      timestamptz NOT NULL DEFAULT now()
);
