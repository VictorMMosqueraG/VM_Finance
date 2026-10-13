import { TransactionType } from './enums.js';
import { percentOf, sumCop, type Cop } from './money.js';

export interface IncomeSourceInput {
  name: string;
  amount: Cop;
  /** Porcentaje (0–100) que va directo al ahorro del mes. */
  savingsPercent: number;
}

export interface TransactionInput {
  type: TransactionType;
  amount: Cop;
}

export interface MonthlyKpis {
  totalIncome: Cop;
  /** Parte de los ingresos que se separa al ahorro según cada fuente. */
  savingsFromIncome: Cop;
  /** Ahorro bruto = ahorro de ingresos + abonos extra (ADD_SAVINGS). */
  grossSavings: Cop;
  fromSavingsExpenses: Cop;
  /** 💰 Ahorro neto disponible = ahorro bruto − gastos FROM_SAVINGS. */
  netSavings: Cop;
  /** Ingresos que quedan para cubrir obligaciones y gastos del mes. */
  spendableIncome: Cop;
  fixedExpenses: Cop;
  variableExpenses: Cop;
  extraIncome: Cop;
  /** 🟢 Disponible para gastar = ingresos gastables − fijos − varios + ingresos extra. */
  available: Cop;
}

function totalOf(transactions: readonly TransactionInput[], type: TransactionType): Cop {
  return sumCop(transactions.filter((t) => t.type === type).map((t) => t.amount));
}

/**
 * Reglas financieras del mes. Se comparten entre backend (dashboard) y
 * frontend (KPIs en vivo del formulario) para que ambos calculen igual.
 */
export function calculateMonthlyKpis(
  incomes: readonly IncomeSourceInput[],
  transactions: readonly TransactionInput[],
): MonthlyKpis {
  const totalIncome = sumCop(incomes.map((i) => i.amount));
  const savingsFromIncome = sumCop(incomes.map((i) => percentOf(i.amount, i.savingsPercent)));
  const spendableIncome = totalIncome - savingsFromIncome;

  const addSavings = totalOf(transactions, TransactionType.ADD_SAVINGS);
  const fromSavingsExpenses = totalOf(transactions, TransactionType.FROM_SAVINGS);
  const fixedExpenses = totalOf(transactions, TransactionType.FIXED_EXPENSE);
  const variableExpenses = totalOf(transactions, TransactionType.VARIABLE_SALARY);
  const extraIncome = totalOf(transactions, TransactionType.EXTRA_INCOME);

  const grossSavings = savingsFromIncome + addSavings;

  return {
    totalIncome,
    savingsFromIncome,
    grossSavings,
    fromSavingsExpenses,
    netSavings: grossSavings - fromSavingsExpenses,
    spendableIncome,
    fixedExpenses,
    variableExpenses,
    extraIncome,
    available: spendableIncome - fixedExpenses - variableExpenses + extraIncome,
  };
}
