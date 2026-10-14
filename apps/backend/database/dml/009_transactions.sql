SET search_path TO vm_finance;

INSERT INTO transactions (user_id, budget_id, type, amount, category_id, detail, occurred_on)
SELECT r.user_id, b.id, 'FIXED_EXPENSE', r.amount, r.category_id, r.name, make_date(2026, 9, r.due_day)
FROM payment_reminders r
JOIN users u ON u.id = r.user_id
JOIN monthly_budgets b ON b.user_id = u.id AND b.period = '2026-09'
WHERE u.email = 'victor@vmfinance.local';

INSERT INTO transactions (user_id, budget_id, type, amount, category_id, detail, occurred_on, debt_id)
SELECT u.id, b.id, e.type::transaction_type, e.amount, c.id, e.detail, make_date(2026, 9, e.day), d.id
FROM users u
JOIN monthly_budgets b ON b.user_id = u.id AND b.period = '2026-09'
CROSS JOIN (VALUES
  ('VARIABLE_SALARY', 'Gordito Llanero',       163000,  6, 'Comida',          NULL),
  ('VARIABLE_SALARY', 'Mercatodo',             161929,  7, 'Mercado',         NULL),
  ('VARIABLE_SALARY', 'Dapa',                  110000, 13, 'Salidas',         NULL),
  ('VARIABLE_SALARY', 'Abono Regalos Navidad',  80000, 15, 'Regalos',         'Regalos Navidad'),
  ('VARIABLE_SALARY', 'Gym',                    75000,  2, 'Salud y deporte', NULL),
  ('VARIABLE_SALARY', 'Luisa Ciclovía',          7000, 21, 'Otros',           NULL),
  ('FROM_SAVINGS',    'I.A',                   350000,  3, 'Tecnología',      NULL),
  ('FROM_SAVINGS',    'Suplementos',           335000,  9, 'Salud y deporte', NULL),
  ('FROM_SAVINGS',    'Burritos',              140000, 19, 'Comida',          NULL)
) AS e (type, detail, amount, day, category, debt)
JOIN categories c ON c.user_id = u.id AND c.name = e.category
LEFT JOIN debts d ON d.user_id = u.id AND d.name = e.debt
WHERE u.email = 'victor@vmfinance.local';
