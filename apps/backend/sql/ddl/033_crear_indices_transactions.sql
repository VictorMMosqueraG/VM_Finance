SET search_path TO vm_finance;

CREATE INDEX idx_transactions_debt_id ON transactions (debt_id);
CREATE INDEX idx_transactions_budget_id_type ON transactions (budget_id, type);
CREATE INDEX idx_transactions_user_id_occurred_on ON transactions (user_id, occurred_on);
