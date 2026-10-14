# VM-Finance

PWA de finanzas personales multi-usuario, instalable en iPhone desde Safari (sin App Store), con recordatorios de pagos y costo de infraestructura $0.

| Carpeta           | Qué es                                        | Tecnología                                             |
| ----------------- | --------------------------------------------- | ------------------------------------------------------ |
| `apps/backend`        | API REST                                      | NestJS 12 · TypeORM 1 · PostgreSQL                     |
| `apps/frontend`        | App móvil (PWA)                               | Angular 22 · Signals · Tailwind CSS 4 · Service Worker |
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
npm install                                   # instala todo
cp apps/backend/.env.example apps/backend/.env        # ajusta DATABASE_URL si hace falta
npm run db:up                                 # Postgres local (base vacía)
# Ejecuta en tu cliente SQL los scripts de apps/backend/sql en orden (ver «Base de datos»)
npm run dev                                   # shared + backend + frontend en paralelo
```

El DML crea el usuario `victor@vmfinance.local` con contraseña `VmFinance2026!` (solo desarrollo). El último script (`dml/011_verificar_septiembre_2026.sql`) comprueba que septiembre cuadre: **Disponible $ 45.408** y **Ahorro neto $ 4.652.444**.

- Web: http://localhost:4200
- API: http://localhost:3000/api/health

En desarrollo la web llama a `/api/...` y `ng serve` lo redirige a la API (`apps/frontend/proxy.conf.json`), así no hay problemas de CORS.

### Probar en el iPhone dentro de tu red

```bash
npm run dev:backend                               # en una terminal
npm run start:lan -w @vm-finance/frontend          # en otra
```

Abre `http://<IP-de-tu-Mac>:4200` en Safari. Para **instalar** la PWA y recibir notificaciones se necesita HTTPS, es decir, la versión desplegada (Fase 9 del plan).

## Scripts (desde la raíz)

| Script                                | Qué hace                                 |
| ------------------------------------- | ---------------------------------------- |
| `npm run dev`                         | Levanta shared (watch), backend y frontend juntos |
| `npm run dev:backend` / `npm run dev:frontend` | Solo uno de los dos                      |
| `npm run build`                       | Compila los tres paquetes                |
| `npm test`                            | Pruebas unitarias de todo el monorepo    |
| `npm run typecheck`                   | Verificación de tipos                    |
| `npm run db:up` / `db:down`           | Postgres local con Docker                |
| `npm run db:reset`                    | Apaga Postgres y borra sus datos         |

### Base de datos

Scripts en `apps/backend/sql/`, que se ejecutan a mano en orden de número: primero todo `ddl/`, luego todo `dml/`.

| Archivos | Contenido |
| --- | --- |
| `ddl/001` | Esquema `vm_finance` |
| `ddl/002` | Tipos enum |
| `ddl/003`–`016` | Una tabla por archivo, solo columnas |
| `ddl/017`–`030` | Constraints de cada tabla (llave primaria, únicos, CHECK y foráneas), un archivo por tabla |
| `ddl/031`–`035` | Índices de cada tabla que los necesita, un archivo por tabla |
| `dml/001`–`010` | Datos de desarrollo, un archivo por entidad |
| `dml/011` | Verificación de septiembre 2026 |

- Los DML se pueden volver a ejecutar: el primero borra el usuario semilla y sus datos en cascada.
- Para cambiar una tabla: crear un script nuevo con el siguiente número (por ejemplo `ddl/036_agregar_color_a_categories.sql`) y actualizar la entidad en `apps/backend/src/use-cases/entities/`. Los scripts ya aplicados no se editan.
- TypeORM solo consulta, en el esquema `vm_finance`; nunca crea ni modifica tablas (`synchronize` está apagado).
- Cliente SQL sugerido: TablePlus, DBeaver o la extensión de PostgreSQL de VS Code, con los datos de `apps/backend/.env`.

## Despliegue ($0)

| Pieza                         | Servicio                                                                                                                                |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Web (PWA)                     | Cloudflare Pages · build `npm run build -w @vm-finance/shared && npm run build -w @vm-finance/frontend` · salida `apps/frontend/dist/frontend/browser` |
| API                           | Render (Free Web Service)                                                                                                               |
| Base de datos                 | Neon (Free)                                                                                                                             |
| Recordatorio diario 8:00 a.m. | GitHub Actions (`cron: '0 13 * * *'`)                                                                                                   |
| Notificaciones                | Web Push (VAPID) + correo opcional con Brevo (API HTTP)                                                                                 |

Detalle completo y orden de trabajo en [`docs/PLAN-MVP.md`](docs/PLAN-MVP.md).
