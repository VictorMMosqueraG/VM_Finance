SET search_path TO vm_finance;

ALTER TABLE monthly_incomes ADD CONSTRAINT pk_monthly_incomes PRIMARY KEY (id);

ALTER TABLE monthly_incomes ADD CONSTRAINT uq_monthly_incomes_budget_id_income_source_id UNIQUE (budget_id, income_source_id);

ALTER TABLE monthly_incomes ADD CONSTRAINT chk_monthly_incomes_savings_percent CHECK (savings_percent BETWEEN 0 AND 100);
ALTER TABLE monthly_incomes ADD CONSTRAINT chk_monthly_incomes_amount CHECK (amount >= 0);

ALTER TABLE monthly_incomes ADD CONSTRAINT fk_monthly_incomes_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE monthly_incomes ADD CONSTRAINT fk_monthly_incomes_budget_id FOREIGN KEY (budget_id) REFERENCES monthly_budgets(id) ON DELETE CASCADE;
ALTER TABLE monthly_incomes ADD CONSTRAINT fk_monthly_incomes_income_source_id FOREIGN KEY (income_source_id) REFERENCES income_sources(id) ON DELETE SET NULL;
