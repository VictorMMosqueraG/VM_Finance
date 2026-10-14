import { Test, type TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: PrismaService, useValue: { isConfigured: true, isHealthy: async () => true } },
      ],
    }).compile();

    controller = module.get(HealthController);
  });

  it('reporta la API y la base de datos como disponibles', async () => {
    const result = await controller.check();
    expect(result.status).toBe('ok');
    expect(result.database).toBe('up');
  });
});
