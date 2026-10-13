/** Prefijo global de la API (NestJS `setGlobalPrefix`) y del proxy del frontend. */
export const API_PREFIX = 'api';

/** Zona horaria oficial del sistema. */
export const APP_TIMEZONE = 'America/Bogota';

export interface HealthResponse {
  status: 'ok';
  service: 'vm-finance-api';
  version: string;
  database: 'up' | 'down' | 'not-configured';
  timestamp: string;
}
