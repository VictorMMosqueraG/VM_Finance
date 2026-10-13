import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // En Neon: usar la URL DIRECTA (sin -pooler) para migraciones.
    url: env('DIRECT_URL'),
  },
});
