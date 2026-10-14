import type { DataSourceOptions } from 'typeorm';
import { ENTITIES } from '../use-cases/entities/index.js';
import { SnakeNamingStrategy } from './snake-naming.strategy.js';

export function buildDataSourceOptions(url: string): DataSourceOptions {
  return {
    type: 'postgres',
    url,
    schema: 'vm_finance',
    entities: ENTITIES,
    namingStrategy: new SnakeNamingStrategy(),
    uuidExtension: 'pgcrypto',
    installExtensions: false,
    synchronize: false,
    migrationsRun: false,
    logging: ['error', 'warn'],
  };
}
