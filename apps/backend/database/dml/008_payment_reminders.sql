SET search_path TO vm_finance;

INSERT INTO payment_reminders (user_id, name, amount, due_day, category_id)
SELECT u.id, r.name, r.amount, r.due_day, c.id
FROM users u
CROSS JOIN (VALUES
  ('Crédito SUFI',        1800000,  5, 'Créditos'),
  ('Valor Aportes',        695900, 10, 'Aportes y fondos'),
  ('Cadena',               300000, 15, 'Aportes y fondos'),
  ('Sueldo Mamá/Netflix',  220000,  1, 'Familia'),
  ('Fondo Nacional',       200000, 15, 'Aportes y fondos'),
  ('Gasolina Draco',       165000, 20, 'Transporte'),
  ('Fondo EMI',             90000, 10, 'Salud y deporte'),
  ('Plan Celular',          41899, 18, 'Servicios'),
  ('PLL',                   24000, 25, 'Otros'),
  ('Cuota Manejo Banco',    14900, 28, 'Banco')
) AS r (name, amount, due_day, category)
JOIN categories c ON c.user_id = u.id AND c.name = r.category
WHERE u.email = 'victor@vmfinance.local';
