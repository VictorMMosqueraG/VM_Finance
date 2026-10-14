SET search_path TO vm_finance;

INSERT INTO monthly_budgets (user_id, period)
SELECT id, '2026-09' FROM users WHERE email = 'victor@vmfinance.local';
