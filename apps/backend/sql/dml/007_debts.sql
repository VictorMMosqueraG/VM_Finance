SET search_path TO vm_finance;

INSERT INTO debts (user_id, name, total_amount)
SELECT id, 'Regalos Navidad', 207500 FROM users WHERE email = 'victor@vmfinance.local';
