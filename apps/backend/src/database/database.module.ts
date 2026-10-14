import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConnectionService } from './database-connection.service.js';
import { buildDataSourceOptions } from './typeorm.options.js';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ...buildDataSourceOptions(config.get<string>('DATABASE_URL') ?? ''),
        manualInitialization: true,
      }),
    }),
  ],
  providers: [DatabaseConnectionService],
  exports: [DatabaseConnectionService],
})
export class DatabaseModule {}
