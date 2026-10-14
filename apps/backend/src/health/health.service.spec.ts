import { HealthService } from './health.service.js';
import type { HealthIndicator } from './indicators/health-indicator.interface.js';

const indicator = (name: string, check: HealthIndicator['check']): HealthIndicator => ({
  name,
  check,
});

describe('HealthService', () => {
  it('responde ok cuando todos los indicadores están arriba', async () => {
    const service = new HealthService([indicator('database', async () => ({ status: 'up' }))]);
    const result = await service.check();
    expect(result.status).toBe('ok');
    expect(result.checks.database.status).toBe('up');
  });

  it('responde degraded si un indicador falla, sin afectar a los demás', async () => {
    const service = new HealthService([
      indicator('database', async () => ({ status: 'up' })),
      indicator('mail', async () => {
        throw new Error('caído');
      }),
    ]);
    const result = await service.check();
    expect(result.status).toBe('degraded');
    expect(result.checks.database.status).toBe('up');
    expect(result.checks.mail).toMatchObject({ status: 'down', detail: 'Error al verificar' });
  });

  it('no cuenta not-configured como caída', async () => {
    const service = new HealthService([
      indicator('database', async () => ({ status: 'not-configured' })),
    ]);
    expect((await service.check()).status).toBe('ok');
  });
});
