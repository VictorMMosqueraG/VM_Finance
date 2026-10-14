SET search_path TO vm_finance;

INSERT INTO income_sources (user_id, name, default_amount, savings_percent, sort_order)
SELECT u.id, s.name, s.amount, s.savings_percent, s.sort_order
FROM users u
CROSS JOIN (VALUES
  ('Sueldo Carga Ya', 3680000, 100, 0),
  ('Sueldo Koral',    5991480,  30, 1)
) AS s (name, amount, savings_percent, sort_order)
WHERE u.email = 'victor@vmfinance.local';
