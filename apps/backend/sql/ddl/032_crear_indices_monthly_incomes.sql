SET search_path TO vm_finance;

CREATE INDEX idx_monthly_incomes_user_id ON monthly_incomes (user_id);
