/**
 * Todos los montos del sistema son ENTEROS en pesos colombianos (COP).
 * Nunca usar decimales ni Float para dinero.
 */
export type Cop = number;

const copFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Formatea un monto como `$ 45.408`. */
export function formatCop(amount: Cop): string {
  // Intl usa un espacio duro (U+00A0) entre el símbolo y el número; lo normalizamos.
  return copFormatter.format(amount).replace(/ /g, ' ');
}

/** Porcentaje de un monto, redondeado al peso. `percentOf(5_991_480, 30) === 1_797_444`. */
export function percentOf(amount: Cop, percent: number): Cop {
  return Math.round((amount * percent) / 100);
}

/** Suma segura de montos enteros. */
export function sumCop(amounts: readonly Cop[]): Cop {
  return amounts.reduce((total, value) => total + value, 0);
}
