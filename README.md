# VM-Finance

PWA de finanzas personales multi-usuario, instalable en iPhone desde Safari (sin App Store), con recordatorios de pagos y costo de infraestructura $0.

| Carpeta           | Qué es                                        | Tecnología                                             |
| ----------------- | --------------------------------------------- | ------------------------------------------------------ |
| `apps/api`        | API REST                                      | NestJS 12 · Prisma 7 · PostgreSQL                      |
| `apps/web`        | App móvil (PWA)                               | Angular 22 · Signals · Tailwind CSS 4 · Service Worker |
| `packages/shared` | Tipos, enums y reglas financieras compartidas | TypeScript                                             |

## Requisitos

- **Node.js 24** (hay un `.nvmrc`; con nvm: `nvm use`). También sirve Node 22.22.3 o superior.
- **PostgreSQL** para desarrollo, una de estas opciones:
  - Docker Desktop → `npm run db:up` (usa `docker-compose.yml`).
  - [Postgres.app](https://postgresapp.com/) en macOS.
  - Una rama de desarrollo gratis en [Neon](https://neon.tech).

La API arranca aunque no haya base de datos (el endpoint de salud mostrará `database: down`).

## Primeros pasos

```bash
npm install                                   # instala todo y genera el cliente Prisma
cp apps/api/.env.example apps/api/.env        # ajusta DATABASE_URL / DIRECT_URL si hace falta
npm run db:up                                 # opcional: Postgres local con Docker
npm run dev                                   # shared + api + web en paralelo
```

- Web: http://localhost:4200
- API: http://localhost:3000/api/health

En desarrollo la web llama a `/api/...` y `ng serve` lo redirige a la API (`apps/web/proxy.conf.json`), así no hay problemas de CORS.

### Probar en el iPhone dentro de tu red

```bash
npm run dev:api                               # en una terminal
npm run start:lan -w @vm-finance/web          # en otra
```

Abre `http://<IP-de-tu-Mac>:4200` en Safari. Para **instalar** la PWA y recibir notificaciones se necesita HTTPS, es decir, la versión desplegada (Fase 9 del plan).

## Scripts (desde la raíz)

| Script                                | Qué hace                                 |
| ------------------------------------- | ---------------------------------------- |
| `npm run dev`                         | Levanta shared (watch), API y web juntos |
| `npm run dev:api` / `npm run dev:web` | Solo uno de los dos                      |
| `npm run build`                       | Compila los tres paquetes                |
| `npm test`                            | Pruebas unitarias de todo el monorepo    |
| `npm run typecheck`                   | Verificación de tipos                    |
| `npm run db:up` / `db:down`           | Postgres local con Docker                |
| `npm run db:migrate`                  | `prisma migrate dev`                     |
| `npm run db:studio`                   | Prisma Studio                            |
| `npm run format`                      | Prettier                                 |

## Despliegue ($0)

| Pieza                         | Servicio                                                                                                                                |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Web (PWA)                     | Cloudflare Pages · build `npm run build -w @vm-finance/shared && npm run build -w @vm-finance/web` · salida `apps/web/dist/web/browser` |
| API                           | Render (Free Web Service)                                                                                                               |
| Base de datos                 | Neon (Free)                                                                                                                             |
| Recordatorio diario 8:00 a.m. | GitHub Actions (`cron: '0 13 * * *'`)                                                                                                   |
| Notificaciones                | Web Push (VAPID) + correo opcional con Brevo (API HTTP)                                                                                 |

Detalle completo y orden de trabajo en [`docs/PLAN-MVP.md`](docs/PLAN-MVP.md).
