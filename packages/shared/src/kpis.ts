import { TransactionType } from './enums/index.js';
import { percentOf, sumCop, type Cop } from './money.js';

export interface IncomeSourceInput {
  name: string;
  amount: Cop;
  savingsPercent: number;
}

export interface TransactionInput {
  type: TransactionType;
  amount: Cop;
}

export interface MonthlyKpis {
  totalIncome: Cop;
  savingsFromIncome: Cop;
  grossSavings: Cop;
  fromSavingsExpenses: Cop;
  netSavings: Cop;
  spendableIncome: Cop;
  fixedExpenses: Cop;
  variableExpenses: Cop;
  extraIncome: Cop;
  available: Cop;
}

function totalOf(transactions: readonly TransactionInput[], type: TransactionType): Cop {
  return sumCop(transactions.filter((t) => t.type === type).map((t) => t.amount));
}

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
