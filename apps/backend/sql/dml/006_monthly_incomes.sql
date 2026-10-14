SET search_path TO vm_finance;

INSERT INTO monthly_incomes (user_id, budget_id, income_source_id, name, amount, savings_percent)
SELECT s.user_id, b.id, s.id, s.name, s.default_amount, s.savings_percent
FROM income_sources s
JOIN users u ON u.id = s.user_id
JOIN monthly_budgets b ON b.user_id = u.id AND b.period = '2026-09'
WHERE u.email = 'victor@vmfinance.local';
