import { Injectable, Logger, type OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

/**
 * Cliente Prisma compartido. La conexión es perezosa: la API arranca aunque
 * la base de datos no esté disponible y se conecta en la primera consulta.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  readonly isConfigured: boolean;

  constructor(config: ConfigService) {
    const connectionString = config.get<string>('DATABASE_URL') ?? '';
    super({ adapter: new PrismaPg({ connectionString }) });
    this.isConfigured = connectionString.length > 0;
    if (!this.isConfigured) {
      this.logger.warn('DATABASE_URL no está definida: la API corre sin base de datos.');
    }
  }

  async isHealthy(): Promise<boolean> {
    if (!this.isConfigured) return false;
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
