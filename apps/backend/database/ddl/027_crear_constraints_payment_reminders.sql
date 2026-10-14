SET search_path TO vm_finance;

ALTER TABLE payment_reminders ADD CONSTRAINT pk_payment_reminders PRIMARY KEY (id);

ALTER TABLE payment_reminders ADD CONSTRAINT uq_payment_reminders_user_id_name UNIQUE (user_id, name);

ALTER TABLE payment_reminders ADD CONSTRAINT chk_payment_reminders_notify_days CHECK (0 <= ALL (notify_days_before));
ALTER TABLE payment_reminders ADD CONSTRAINT chk_payment_reminders_due_day CHECK (due_day BETWEEN 1 AND 31);
ALTER TABLE payment_reminders ADD CONSTRAINT chk_payment_reminders_amount CHECK (amount >= 0);

ALTER TABLE payment_reminders ADD CONSTRAINT fk_payment_reminders_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE payment_reminders ADD CONSTRAINT fk_payment_reminders_category_id FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;
