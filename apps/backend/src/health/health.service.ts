import { Inject, Injectable } from '@nestjs/common';
import type { HealthCheckResult, HealthResponse } from '@vm-finance/shared';
import type { IHealthService } from './health.service.interface.js';
import {
  HEALTH_INDICATORS,
  type HealthIndicator,
  type HealthIndicatorResult,
} from './indicators/health-indicator.interface.js';

const INDICATOR_TIMEOUT_MS = 3_000;

/** Ejecuta todos los indicadores en paralelo y arma una sola respuesta. */
@Injectable()
export class HealthService implements IHealthService {
  constructor(@Inject(HEALTH_INDICATORS) private readonly indicators: HealthIndicator[]) {}

  async check(): Promise<HealthResponse> {
    const results = await Promise.all(
      this.indicators.map(
        async (indicator) => [indicator.name, await this.run(indicator)] as const,
      ),
    );
    const checks = Object.fromEntries(results);
    const allUp = results.every(([, result]) => result.status !== 'down');

    return {
      status: allUp ? 'ok' : 'degraded',
      service: 'vm-finance-api',
      version: process.env.npm_package_version ?? '0.1.0',
      timestamp: new Date().toISOString(),
      checks,
    };
  }

  private async run(indicator: HealthIndicator): Promise<HealthCheckResult> {
    const startedAt = performance.now();
    let result: HealthIndicatorResult;
    try {
      result = await withTimeout(indicator.check(), INDICATOR_TIMEOUT_MS);
    } catch (error) {
      result = {
        status: 'down',
        detail: error instanceof TimeoutError ? 'Tiempo de espera agotado' : 'Error al verificar',
      };
    }
    return { ...result, durationMs: Math.round(performance.now() - startedAt) };
  }
}

class TimeoutError extends Error {}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new TimeoutError()), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}
