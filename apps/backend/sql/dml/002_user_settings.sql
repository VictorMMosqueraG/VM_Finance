SET search_path TO vm_finance;

INSERT INTO user_settings (user_id)
SELECT id FROM users WHERE email = 'victor@vmfinance.local';
