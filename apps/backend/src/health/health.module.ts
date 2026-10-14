import { Module } from '@nestjs/common';
import { HealthController } from './health.controller.js';
import { HEALTH_SERVICE } from './health.service.interface.js';
import { HealthService } from './health.service.js';
import {
  HEALTH_INDICATORS,
  type HealthIndicator,
} from './indicators/health-indicator.interface.js';
import { INDICATORS } from './indicators/index.js';

@Module({
  controllers: [HealthController],
  providers: [
    ...INDICATORS,
    {
      provide: HEALTH_INDICATORS,
      useFactory: (...indicators: HealthIndicator[]) => indicators,
      inject: INDICATORS,
    },
    { provide: HEALTH_SERVICE, useClass: HealthService },
  ],
})
export class HealthModule {}
