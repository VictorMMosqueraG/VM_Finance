SET search_path TO vm_finance;

ALTER TABLE payment_instances ADD CONSTRAINT pk_payment_instances PRIMARY KEY (id);

ALTER TABLE payment_instances ADD CONSTRAINT uq_payment_instances_reminder_id_period UNIQUE (reminder_id, period);
ALTER TABLE payment_instances ADD CONSTRAINT uq_payment_instances_transaction_id UNIQUE (transaction_id);

ALTER TABLE payment_instances ADD CONSTRAINT chk_payment_instances_paid_at CHECK (status <> 'PAID' OR paid_at IS NOT NULL);
ALTER TABLE payment_instances ADD CONSTRAINT chk_payment_instances_period CHECK (period ~ '^[0-9]{4}-(0[1-9]|1[0-2])$');
ALTER TABLE payment_instances ADD CONSTRAINT chk_payment_instances_amount CHECK (amount >= 0);

ALTER TABLE payment_instances ADD CONSTRAINT fk_payment_instances_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE payment_instances ADD CONSTRAINT fk_payment_instances_reminder_id FOREIGN KEY (reminder_id) REFERENCES payment_reminders(id) ON DELETE CASCADE;
ALTER TABLE payment_instances ADD CONSTRAINT fk_payment_instances_budget_id FOREIGN KEY (budget_id) REFERENCES monthly_budgets(id) ON DELETE CASCADE;
ALTER TABLE payment_instances ADD CONSTRAINT fk_payment_instances_transaction_id FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE SET NULL;
