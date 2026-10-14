SET search_path TO vm_finance;

DELETE FROM users WHERE email = 'victor@vmfinance.local';

INSERT INTO users (email, password_hash, name, updated_at)
VALUES (
  'victor@vmfinance.local',
  '$2b$12$We3eO2utlOqbfTyeL4O7ie8KMy8qrXWRiMreg2jN268AqlPDnxzi2',
  'Víctor Mosquera',
  now()
);
