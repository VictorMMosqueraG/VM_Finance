import { Injectable } from '@nestjs/common';
import { DatabaseConnectionService } from '../../database/database-connection.service.js';
import type { HealthIndicator, HealthIndicatorResult } from './health-indicator.interface.js';

@Injectable()
export class DatabaseHealthIndicator implements HealthIndicator {
  readonly name = 'database';

  constructor(private readonly database: DatabaseConnectionService) {}

  async check(): Promise<HealthIndicatorResult> {
    if (!this.database.isConfigured) return { status: 'not-configured' };
    if (!(await this.database.ensureConnected())) {
      return { status: 'down', detail: 'Sin conexión' };
    }
    await this.database.ping();
    return { status: 'up' };
  }
}
