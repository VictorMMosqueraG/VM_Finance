import { Controller, Get } from '@nestjs/common';
import type { HealthResponse } from '@vm-finance/shared';
import { PrismaService } from '../prisma/prisma.service.js';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async check(): Promise<HealthResponse> {
    const database = !this.prisma.isConfigured
      ? 'not-configured'
      : (await this.prisma.isHealthy())
        ? 'up'
        : 'down';

    return {
      status: 'ok',
      service: 'vm-finance-api',
      version: process.env.npm_package_version ?? '0.1.0',
      database,
      timestamp: new Date().toISOString(),
    };
  }
}
