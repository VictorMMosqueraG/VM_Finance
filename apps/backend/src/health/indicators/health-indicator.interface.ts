import type { HealthCheckStatus } from '@vm-finance/shared';

export const HEALTH_INDICATORS = Symbol('HEALTH_INDICATORS');

export interface HealthIndicatorResult {
  status: HealthCheckStatus;
  detail?: string;
}

export interface HealthIndicator {
  readonly name: string;
  check(): Promise<HealthIndicatorResult>;
}
