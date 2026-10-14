SET search_path TO vm_finance;

INSERT INTO payment_instances
  (user_id, reminder_id, budget_id, period, amount, due_date, status, paid_at, transaction_id)
SELECT
  r.user_id, r.id, t.budget_id, '2026-09', r.amount, t.occurred_on, 'PAID',
  (t.occurred_on + time '12:00') AT TIME ZONE 'America/Bogota',
  t.id
FROM payment_reminders r
JOIN users u ON u.id = r.user_id
JOIN transactions t ON t.user_id = r.user_id AND t.type = 'FIXED_EXPENSE' AND t.detail = r.name
WHERE u.email = 'victor@vmfinance.local';
