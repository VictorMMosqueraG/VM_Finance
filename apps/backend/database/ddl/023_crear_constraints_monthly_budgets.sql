SET search_path TO vm_finance;

ALTER TABLE monthly_budgets ADD CONSTRAINT pk_monthly_budgets PRIMARY KEY (id);

ALTER TABLE monthly_budgets ADD CONSTRAINT uq_monthly_budgets_user_id_period UNIQUE (user_id, period);

ALTER TABLE monthly_budgets ADD CONSTRAINT chk_monthly_budgets_period CHECK (period ~ '^[0-9]{4}-(0[1-9]|1[0-2])$');

ALTER TABLE monthly_budgets ADD CONSTRAINT fk_monthly_budgets_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
