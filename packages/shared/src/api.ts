/** Prefijo global de la API (NestJS `setGlobalPrefix`) y del proxy del frontend. */
export const API_PREFIX = 'api';

/** Zona horaria oficial del sistema. */
export const APP_TIMEZONE = 'America/Bogota';

export type HealthCheckStatus = 'up' | 'down' | 'not-configured';

export interface HealthCheckResult {
  status: HealthCheckStatus;
  durationMs: number;
  detail?: string;
}

export type HealthStatus = 'ok' | 'degraded';

export interface HealthResponse {
  status: HealthStatus;
  service: 'vm-finance-api';
  version: string;
  timestamp: string;
  /** Una entrada por indicador: `database`, y los que se agreguen después. */
  checks: Record<string, HealthCheckResult>;
}
