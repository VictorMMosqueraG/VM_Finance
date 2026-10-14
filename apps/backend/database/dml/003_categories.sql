SET search_path TO vm_finance;

INSERT INTO categories (user_id, name)
SELECT u.id, c.name
FROM users u
CROSS JOIN (VALUES
  ('Créditos'), ('Aportes y fondos'), ('Familia'), ('Transporte'), ('Salud y deporte'),
  ('Servicios'), ('Banco'), ('Comida'), ('Mercado'), ('Salidas'), ('Regalos'),
  ('Tecnología'), ('Otros')
) AS c (name)
WHERE u.email = 'victor@vmfinance.local';
