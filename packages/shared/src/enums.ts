/**
 * Tipos de movimiento. Se declaran como objetos `as const` (y no `enum`)
 * para que funcionen igual en NestJS, Angular y Prisma sin código extra.
 */
export const TransactionType = {
  /** Obligación fija del mes (crédito, aportes, plan celular...). */
  FIXED_EXPENSE: 'FIXED_EXPENSE',
  /** Gasto varios pagado con el sueldo disponible. */
  VARIABLE_SALARY: 'VARIABLE_SALARY',
  /** Compra que se descuenta del ahorro. */
  FROM_SAVINGS: 'FROM_SAVINGS',
  /** Abono extra al ahorro. */
  ADD_SAVINGS: 'ADD_SAVINGS',
  /** Ingreso extra que suma al disponible del mes. */
  EXTRA_INCOME: 'EXTRA_INCOME',
} as const;
export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType];

export const PaymentStatus = {
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  PAID: 'PAID',
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

/** Semáforo de vencimientos para el widget "Próximos Pagos". */
export const DueUrgency = {
  OVERDUE_OR_TODAY: 'OVERDUE_OR_TODAY',
  SOON: 'SOON',
  OK: 'OK',
} as const;
export type DueUrgency = (typeof DueUrgency)[keyof typeof DueUrgency];
