SET search_path TO vm_finance;

ALTER TABLE reminder_logs ADD CONSTRAINT pk_reminder_logs PRIMARY KEY (id);

ALTER TABLE reminder_logs ADD CONSTRAINT uq_reminder_logs_instance_id_sent_on_channel_offset_days UNIQUE (instance_id, sent_on, channel, offset_days);

ALTER TABLE reminder_logs ADD CONSTRAINT chk_reminder_logs_offset_days CHECK (offset_days >= 0);

ALTER TABLE reminder_logs ADD CONSTRAINT fk_reminder_logs_instance_id FOREIGN KEY (instance_id) REFERENCES payment_instances(id) ON DELETE CASCADE;
