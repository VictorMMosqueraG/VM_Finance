import { Injectable, Logger, type OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';


@Injectable()
export class DatabaseConnectionService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseConnectionService.name);
  readonly isConfigured: boolean;

  constructor(
    private readonly dataSource: DataSource,
    config: ConfigService,
  ) {
    this.isConfigured = (config.get<string>('DATABASE_URL') ?? '').length > 0;
  }

  async onApplicationBootstrap(): Promise<void> {
    if (!this.isConfigured) {
      this.logger.warn('DATABASE_URL no está definida: la API corre sin base de datos.');
      return;
    }
    if (!(await this.ensureConnected())) {
      this.logger.warn('No se pudo conectar a la base de datos; se reintentará más tarde.');
    }
  }

  async ensureConnected(): Promise<boolean> {
    if (!this.isConfigured) return false;
    if (this.dataSource.isInitialized) return true;
    try {
      await this.dataSource.initialize();
      return true;
    } catch {
      return false;
    }
  }

  async ping(): Promise<void> {
    await this.dataSource.query('SELECT 1');
  }
}
