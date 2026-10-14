SET search_path TO vm_finance;

CREATE INDEX idx_payment_instances_budget_id ON payment_instances (budget_id);
CREATE INDEX idx_payment_instances_user_id_status_due_date ON payment_instances (user_id, status, due_date);
