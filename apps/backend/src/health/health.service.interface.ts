import type { HealthResponse } from '@vm-finance/shared';

export const HEALTH_SERVICE = Symbol('HEALTH_SERVICE');

export interface IHealthService {
  check(): Promise<HealthResponse>;
}
