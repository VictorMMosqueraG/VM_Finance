SET search_path TO vm_finance;

ALTER TABLE transactions ADD CONSTRAINT pk_transactions PRIMARY KEY (id);

ALTER TABLE transactions ADD CONSTRAINT chk_transactions_amount CHECK (amount > 0);

ALTER TABLE transactions ADD CONSTRAINT fk_transactions_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE transactions ADD CONSTRAINT fk_transactions_budget_id FOREIGN KEY (budget_id) REFERENCES monthly_budgets(id) ON DELETE CASCADE;
ALTER TABLE transactions ADD CONSTRAINT fk_transactions_category_id FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;
ALTER TABLE transactions ADD CONSTRAINT fk_transactions_debt_id FOREIGN KEY (debt_id) REFERENCES debts(id) ON DELETE SET NULL;
