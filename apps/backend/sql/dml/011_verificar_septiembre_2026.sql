SET search_path TO vm_finance;

DO $$
DECLARE
  v_user_id        uuid;
  v_total_income   integer;
  v_savings_income integer;
  v_fixed          integer;
  v_variable       integer;
  v_from_savings   integer;
  v_add_savings    integer;
  v_extra_income   integer;
  v_available      integer;
  v_net_savings    integer;
  v_debt_pending   integer;
  v_paid           integer;
BEGIN
  SELECT id INTO v_user_id FROM users WHERE email = 'victor@vmfinance.local';
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'No existe el usuario semilla'; END IF;

  SELECT SUM(i.amount), SUM(ROUND(i.amount * i.savings_percent / 100.0))
    INTO v_total_income, v_savings_income
  FROM monthly_incomes i
  JOIN monthly_budgets b ON b.id = i.budget_id
  WHERE b.user_id = v_user_id AND b.period = '2026-09';

  SELECT
    COALESCE(SUM(amount) FILTER (WHERE type = 'FIXED_EXPENSE'), 0),
    COALESCE(SUM(amount) FILTER (WHERE type = 'VARIABLE_SALARY'), 0),
    COALESCE(SUM(amount) FILTER (WHERE type = 'FROM_SAVINGS'), 0),
    COALESCE(SUM(amount) FILTER (WHERE type = 'ADD_SAVINGS'), 0),
    COALESCE(SUM(amount) FILTER (WHERE type = 'EXTRA_INCOME'), 0)
    INTO v_fixed, v_variable, v_from_savings, v_add_savings, v_extra_income
  FROM transactions t
  JOIN monthly_budgets b ON b.id = t.budget_id
  WHERE b.user_id = v_user_id AND b.period = '2026-09';

  v_available   := v_total_income - v_savings_income - v_fixed - v_variable + v_extra_income;
  v_net_savings := v_savings_income + v_add_savings - v_from_savings;

  SELECT d.total_amount - COALESCE(SUM(t.amount), 0) INTO v_debt_pending
  FROM debts d
  LEFT JOIN transactions t ON t.debt_id = d.id
  WHERE d.user_id = v_user_id AND d.name = 'Regalos Navidad'
  GROUP BY d.total_amount;

  SELECT COUNT(*) INTO v_paid
  FROM payment_instances
  WHERE user_id = v_user_id AND period = '2026-09' AND status = 'PAID';

  IF v_total_income  <> 9671480 THEN RAISE EXCEPTION 'Ingresos: % (esperado 9671480)', v_total_income; END IF;
  IF v_fixed         <> 3551699 THEN RAISE EXCEPTION 'Obligaciones fijas: % (esperado 3551699)', v_fixed; END IF;
  IF v_variable      <>  596929 THEN RAISE EXCEPTION 'Gastos varios: % (esperado 596929)', v_variable; END IF;
  IF v_from_savings  <>  825000 THEN RAISE EXCEPTION 'Gastos del ahorro: % (esperado 825000)', v_from_savings; END IF;
  IF v_available     <>   45408 THEN RAISE EXCEPTION 'Disponible: % (esperado 45408)', v_available; END IF;
  IF v_net_savings   <> 4652444 THEN RAISE EXCEPTION 'Ahorro neto: % (esperado 4652444)', v_net_savings; END IF;
  IF v_debt_pending  <>  127500 THEN RAISE EXCEPTION 'Pendiente deuda: % (esperado 127500)', v_debt_pending; END IF;
  IF v_paid          <>      10 THEN RAISE EXCEPTION 'Obligaciones pagadas: % (esperado 10)', v_paid; END IF;

  RAISE NOTICE 'Septiembre 2026 OK: Disponible % · Ahorro neto %', v_available, v_net_savings;
END $$;
