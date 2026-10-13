import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import {
  calculateMonthlyKpis,
  formatCop,
  type HealthResponse,
  TransactionType,
} from '@vm-finance/shared';
import { catchError, map, of } from 'rxjs';
import { HealthService } from './core/health.service';

type ApiState = { kind: 'loading' } | { kind: 'ok'; data: HealthResponse } | { kind: 'error' };

/**
 * Pantalla temporal de verificación del monorepo: comprueba que la web llega a la API
 * y que el paquete compartido calcula los KPIs. Se reemplaza en la Fase 3 (shell iOS).
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
})
export class App {
  private readonly health = inject(HealthService);

  protected readonly title = signal('VM-Finance');
  protected readonly formatCop = formatCop;

  protected readonly api = toSignal(
    this.health.check().pipe(
      map((data): ApiState => ({ kind: 'ok', data })),
      catchError(() => of<ApiState>({ kind: 'error' })),
    ),
    { initialValue: { kind: 'loading' } as ApiState },
  );

  /** Ejemplo con los datos de septiembre 2026: debe dar $ 45.408 y $ 4.652.444. */
  protected readonly kpis = calculateMonthlyKpis(
    [
      { name: 'Sueldo Carga Ya', amount: 3_680_000, savingsPercent: 100 },
      { name: 'Sueldo Koral', amount: 5_991_480, savingsPercent: 30 },
    ],
    [
      { type: TransactionType.FIXED_EXPENSE, amount: 3_551_699 },
      { type: TransactionType.VARIABLE_SALARY, amount: 596_929 },
      { type: TransactionType.FROM_SAVINGS, amount: 825_000 },
    ],
  );
}
