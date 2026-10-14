import { Controller, Get, Inject } from '@nestjs/common';
import type { HealthResponse } from '@vm-finance/shared';
import { HEALTH_SERVICE, type IHealthService } from './health.service.interface.js';

@Controller('health')
export class HealthController {
  constructor(@Inject(HEALTH_SERVICE) private readonly health: IHealthService) {}

  @Get()
  check(): Promise<HealthResponse> {
    return this.health.check();
  }
}
