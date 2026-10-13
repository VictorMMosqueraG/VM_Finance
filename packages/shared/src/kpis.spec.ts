import { describe, expect, it } from 'vitest';
import { TransactionType } from './enums.js';
import { calculateMonthlyKpis, type TransactionInput } from './kpis.js';
import { formatCop, percentOf } from './money.js';

const { FIXED_EXPENSE, VARIABLE_SALARY, FROM_SAVINGS } = TransactionType;

/** Datos reales de septiembre 2026 (documento de contexto). */
const incomes = [
  { name: 'Sueldo Carga Ya', amount: 3_680_000, savingsPercent: 100 },
  { name: 'Sueldo Koral', amount: 5_991_480, savingsPercent: 30 },
];

const fixed = [
  1_800_000, 695_900, 300_000, 220_000, 200_000, 165_000, 90_000, 41_899, 24_000, 14_900,
];
const variable = [163_000, 161_929, 110_000, 80_000, 75_000, 7_000];
const fromSavings = [350_000, 335_000, 140_000];

const transactions: TransactionInput[] = [
  ...fixed.map((amount) => ({ type: FIXED_EXPENSE, amount })),
  ...variable.map((amount) => ({ type: VARIABLE_SALARY, amount })),
  ...fromSavings.map((amount) => ({ type: FROM_SAVINGS, amount })),
];

describe('calculateMonthlyKpis — septiembre 2026', () => {
  const kpis = calculateMonthlyKpis(incomes, transactions);

  it('cuadra ingresos y ahorro del mes', () => {
    expect(kpis.totalIncome).toBe(9_671_480);
    expect(percentOf(5_991_480, 30)).toBe(1_797_444);
    expect(kpis.grossSavings).toBe(5_477_444);
  });

  it('cuadra obligaciones fijas y gastos varios', () => {
    expect(kpis.fixedExpenses).toBe(3_551_699);
    expect(kpis.variableExpenses).toBe(596_929);
  });

  it('disponible del mes = $ 45.408', () => {
    expect(kpis.available).toBe(45_408);
  });

  it('ahorro neto disponible = $ 4.652.444', () => {
    expect(kpis.fromSavingsExpenses).toBe(825_000);
    expect(kpis.netSavings).toBe(4_652_444);
  });
});

describe('formatCop', () => {
  it('usa formato es-CO sin decimales', () => {
    expect(formatCop(45_408)).toBe('$ 45.408');
    expect(formatCop(4_652_444)).toBe('$ 4.652.444');
  });
});
