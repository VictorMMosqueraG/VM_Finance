export const TransactionType = {
  FIXED_EXPENSE: 'FIXED_EXPENSE',
  VARIABLE_SALARY: 'VARIABLE_SALARY',
  FROM_SAVINGS: 'FROM_SAVINGS',
  ADD_SAVINGS: 'ADD_SAVINGS',
  EXTRA_INCOME: 'EXTRA_INCOME',
} as const;

export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType];
