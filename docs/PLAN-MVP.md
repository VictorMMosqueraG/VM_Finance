# Plan de acción — MVP VM-Finance

**Objetivo del MVP:** que varias personas puedan registrarse, llevar el control mensual de ingresos, ahorro, obligaciones fijas y gastos, recibir recordatorios de pago en el iPhone y exportar su mes, con la app instalada desde Safari y costo $0.

**Fuera del MVP (descartado o para después):** aprobación por correo, espacios compartidos entre dos personas (`Workspace`), modo offline con sincronización, gráficos históricos multi-año.

**Criterio de "terminado" del MVP:** con el usuario semilla de septiembre 2026 la app muestra **Disponible $ 45.408** y **Ahorro neto $ 4.652.444**, un segundo usuario no ve nada del primero, y un pago que vence mañana llega como notificación al iPhone a las 8:00 a.m.

---

## Resumen de fases

| #   | Fase                           | Resultado visible                                | Esfuerzo estimado |
| --- | ------------------------------ | ------------------------------------------------ | ----------------- |
| 0   | Monorepo base                  | `npm run dev` levanta API + web                  | ✅ Hecho          |
| 1   | Modelo de datos y seed         | Base de datos con tu usuario y septiembre 2026   | 2 días            |
| 2   | Autenticación y usuarios (API) | Registro, login, refresh, configuración          | 3 días            |
| 3   | Shell iOS y login (web)        | App con barra inferior, login y registro         | 3 días            |
| 4   | Movimientos y KPIs             | Registrar gastos/ingresos y ver saldos correctos | 4 días            |
| 5   | Dashboard                      | Tarjetas KPI, barras de progreso y gráficos      | 2 días            |
| 6   | Recordatorios de pagos         | Pestaña Pagos con semáforo y "Pagado"            | 3 días            |
| 7   | Notificaciones y cron diario   | Push al iPhone y correo opcional a las 8:00 a.m. | 3 días            |
| 8   | Perfil y exportación           | Configuración de ingresos, Excel y PDF           | 3 días            |
| 9   | Despliegue $0                  | App instalada en tu iPhone desde una URL HTTPS   | 1–2 días          |
| 10  | QA y endurecimiento            | Pruebas de aislamiento, seguridad y PWA          | 2 días            |

Total aproximado: **26–27 días de trabajo** (≈ 5–6 semanas a ritmo de medio tiempo). Cada fase termina con algo que se puede probar; despliega temprano (puedes adelantar la Fase 9 justo después de la 3).

---

## Fase 0 — Monorepo base ✅

- npm workspaces: `apps/api`, `apps/web`, `packages/shared`.
- `packages/shared` con `calculateMonthlyKpis`, `formatCop`, enums y contratos; prueba que cuadra septiembre 2026.
- API NestJS con `/api/health`, Prisma 7 configurado (adaptador `pg`, cliente ESM).
- Web Angular 22 con Tailwind 4, PWA (manifest + service worker), meta tags iOS y proxy `/api → :3000`.
- CI en GitHub Actions (typecheck, tests, e2e, build).

## Fase 1 — Modelo de datos y seed

**API — `apps/api/prisma/schema.prisma`**

- [ ] Modelos: `User`, `RefreshToken`, `InviteCode`, `UserSettings`, `IncomeSource`, `MonthlyBudget`, `MonthlyIncome`, `Category`, `Transaction`, `PaymentReminder`, `PaymentInstance`, `ReminderLog`, `PushSubscription`, `DebtTracker`.
- [ ] Montos como `Int` (pesos). `period` como `String` `YYYY-MM` o par `year/month` con índice `(userId, period)`.
- [ ] Enums Prisma alineados con `packages/shared/src/enums.ts` (`TransactionType`, `PaymentStatus`).
- [ ] Restricciones: `@@unique([reminderId, period])` en `PaymentInstance`; `@@unique([instanceId, sentOn, channel, offsetDays])` en `ReminderLog`.
- [ ] `onDelete: Cascade` desde `User` para poder borrar cuentas.
- [ ] Primera migración: `npm run db:migrate -- --name init`.

**Seed — `apps/api/prisma/seed.ts`**

- [ ] Usuario principal Víctor Mosquera con contraseña de desarrollo.
- [ ] Fuentes de ingreso: Sueldo Carga Ya (100 % ahorro) y Sueldo Koral (30 %).
- [ ] Septiembre 2026: 10 obligaciones fijas, 6 gastos varios, 3 gastos del ahorro, recordatorios con `dueDay`, deuda "Abono Regalos Navidad" (total $ 207.500, pendiente $ 127.500).
- [ ] Prueba automática que lee el seed y verifica $ 45.408 y $ 4.652.444 con `calculateMonthlyKpis`.

**Listo cuando:** `npx prisma db seed` corre sin errores y Prisma Studio muestra los datos.

## Fase 2 — Autenticación y usuarios (API)

- [ ] Dependencias: `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`, `bcrypt`, `class-validator`, `class-transformer`, `helmet`, `@nestjs/throttler`.
- [ ] `ValidationPipe` global (`whitelist`, `forbidNonWhitelisted`, `transform`), `helmet`, CORS por `FRONTEND_URL`.
- [ ] `AuthModule`: `POST /auth/register` (con código de invitación opcional según `REGISTRATION_MODE=open|invite`), `POST /auth/login`, `POST /auth/refresh` (rotación, refresh guardado como hash), `POST /auth/logout`.
- [ ] Access token 15 min, refresh 30 días; límite de 5 intentos/minuto en login.
- [ ] `JwtAuthGuard` global + decorador `@Public()` y `@CurrentUser()`.
- [ ] Extensión de Prisma / repositorios que exigen `userId` en toda consulta.
- [ ] `UsersModule`: `GET/PATCH /me`, `GET/PUT /me/settings`, CRUD de `IncomeSource` (porcentaje 0–100).
- [ ] Al registrarse se crean `UserSettings` por defecto.
- [ ] Pruebas e2e: registro → login → `/me`; refresh rotado; token inválido = 401.

**Listo cuando:** puedes registrar dos usuarios con Postman/curl y cada uno ve solo su perfil.

## Fase 3 — Shell iOS y login (web)

- [ ] Estructura `core/` (auth, interceptores, guards), `shared/` (UI, pipes), `features/`.
- [ ] `AuthStore` con Signals; tokens en memoria + refresh en `localStorage` (con try/catch).
- [ ] Interceptor: agrega `Authorization`, renueva con refresh ante 401 y reintenta una vez.
- [ ] Rutas lazy: `/login`, `/registro`, y bajo guard: `/dashboard`, `/registrar`, `/pagos`, `/movimientos`, `/perfil`.
- [ ] Layout iOS: barra inferior de 5 pestañas fija con `safe-bottom`, encabezado con `safe-top`, transiciones suaves.
- [ ] Componentes base: `Card`, `ListRow`, `Segmented`, `MoneyInput` (teclado numérico `inputmode="numeric"`), `Badge`, `EmptyState`.
- [ ] Pipe `copCurrency` sobre `formatCop`.
- [ ] Pantalla "Despertando el servidor…" cuando la primera petición tarda (arranque en frío de Render).

**Listo cuando:** te registras e inicias sesión en la web y navegas entre las 5 pestañas vacías.

## Fase 4 — Movimientos y KPIs

**API**

- [ ] `BudgetsModule`: `GET /budgets/:period` (crea el mes si no existe copiando ingresos y obligaciones del mes anterior), `PUT /budgets/:period/incomes`.
- [ ] `TransactionsModule`: CRUD con filtros por mes, tipo y categoría; `Factory` por tipo (`FIXED_EXPENSE`, `VARIABLE_SALARY`, `FROM_SAVINGS`, `ADD_SAVINGS`, `EXTRA_INCOME`).
- [ ] Vínculo opcional de un gasto con `DebtTracker` (actualiza el pendiente).
- [ ] `DashboardModule`: `GET /dashboard/:period` → `MonthlyKpis` usando `calculateMonthlyKpis` de shared + conteo de obligaciones pagadas/pendientes.

**Web**

- [ ] ➕ **Registrar**: formulario rápido (tipo segmentado, monto, categoría, detalle, fecha) con encabezado fijo que muestra Disponible y Ahorro y se recalcula en vivo con `computed()` antes de guardar.
- [ ] 📋 **Movimientos**: lista del mes agrupada por tipo, deslizar para editar/eliminar, selector de mes.

**Listo cuando:** registrando a mano los datos de septiembre la app muestra exactamente $ 45.408 y $ 4.652.444.

## Fase 5 — Dashboard

- [ ] Tarjetas KPI: Disponible, Ahorro neto, Obligaciones (x de y pagadas), Gastos varios, Ahorro bruto.
- [ ] Barras de progreso: % del sueldo gastable consumido, % del ahorro usado.
- [ ] Gráfico de dona por categoría y barras de ahorro de los últimos 6 meses (Chart.js + `ng2-charts`).
- [ ] Selector de mes y estado vacío para meses sin datos.
- [ ] Espacio reservado para el widget "Próximos Pagos" (se llena en la Fase 6).

**Listo cuando:** el Dashboard refleja cualquier movimiento nuevo sin recargar.

## Fase 6 — Recordatorios de pagos

**API**

- [ ] `RemindersModule`: CRUD de `PaymentReminder` (nombre, monto, `dueDay` 1–31, `notifyDaysBefore` por defecto `[3, 1, 0]`, categoría, `autoCreateTransaction`).
- [ ] Generación idempotente de `PaymentInstance` por mes; `dueDay` mayor que los días del mes → último día.
- [ ] `PATCH /payments/:instanceId/paid` y `/unpaid`: en una sola transacción marca el estado y crea/elimina la transacción fija.
- [ ] `GET /payments/upcoming`: pendientes ordenados por urgencia con `DueUrgency` (vencido/hoy, ≤ 3 días, al día).
- [ ] Pruebas de fechas en `America/Bogota` (31 en febrero, cambio de mes, vencidos de meses anteriores).

**Web**

- [ ] ⏰ **Pagos**: lista del mes con semáforo 🔴🟡🟢, check de "Pagado", total pendiente y formulario de obligaciones.
- [ ] Widget "Próximos Pagos" arriba en el Dashboard.
- [ ] Contador de pendientes en el ícono de la app (Badging API, si está disponible).

**Listo cuando:** marcar "Crédito SUFI" como pagado actualiza Pagos, Movimientos y Dashboard a la vez.

## Fase 7 — Notificaciones y cron diario

- [ ] Llaves VAPID (`npx web-push generate-vapid-keys`) en variables de entorno.
- [ ] `NotificationsModule` con `NotificationPort` y adaptadores `WebPushAdapter` y `BrevoMailAdapter` (API HTTP, no SMTP).
- [ ] `POST /push/subscribe` y `DELETE /push/subscribe`; borrar suscripciones que respondan 404/410.
- [ ] `POST /internal/cron/reminders` protegido con header `X-Cron-Secret`: genera instancias del mes, busca vencimientos según `notifyDaysBefore`, envía **un aviso agrupado por usuario y canal**, registra en `ReminderLog`.
- [ ] Workflow `.github/workflows/reminders.yml` con `cron: '0 13 * * *'` (8:00 a.m. Bogotá) y reintento si la API está despertando.
- [ ] Web: botón "Activar notificaciones" en Perfil (`SwPush.requestSubscription` tras un toque), manejar el clic de la notificación para abrir `/pagos`.
- [ ] Preferencias por usuario: push sí/no, correo sí/no.

**Listo cuando:** ejecutar el workflow manualmente (`workflow_dispatch`) hace llegar la notificación al iPhone con la app instalada.

## Fase 8 — Perfil y exportación

- [ ] ⚙️ **Perfil**: datos personales, fuentes de ingreso y % de ahorro, preferencias de notificación, cerrar sesión, eliminar cuenta.
- [ ] Exportar Excel del mes (`exceljs`): hoja de resumen con KPIs y bloques por color (ingresos, ahorro, fijos, varios, del ahorro) con fórmulas.
- [ ] Exportar PDF del mes (`jspdf` + `jspdf-autotable`) con el mismo resumen.
- [ ] Carga diferida de las librerías de exportación para no inflar el bundle inicial.
- [ ] Pantalla de deudas (`DebtTracker`): total, abonado y pendiente.

**Listo cuando:** el Excel y el PDF de septiembre muestran los mismos totales que el Dashboard.

## Fase 9 — Despliegue $0

- [ ] Repositorio en GitHub (privado).
- [ ] **Neon**: proyecto `vm-finance`, región `us-east`; `DATABASE_URL` (pooler) y `DIRECT_URL` (directa).
- [ ] **Render** (Web Service, Free): raíz del repo; build `npm ci && npm run build -w @vm-finance/shared && npm run build -w @vm-finance/api`; start `npm run prisma:deploy -w @vm-finance/api && npm run start:prod -w @vm-finance/api`; variables de entorno.
- [ ] **Cloudflare Pages**: build `npm run build -w @vm-finance/shared && npm run build -w @vm-finance/web`; salida `apps/web/dist/web/browser`; `_redirects` con `/* /index.html 200`; variable con la URL de la API (archivo `environment` o `config.json` en runtime).
- [ ] GitHub Actions: secretos `API_URL` y `CRON_SECRET` para el workflow de recordatorios.
- [ ] En el iPhone: Safari → Compartir → Agregar a pantalla de inicio → Perfil → Activar notificaciones.

**Listo cuando:** la app abre en modo standalone desde el ícono y conserva la sesión.

## Fase 10 — QA y endurecimiento

- [ ] Prueba e2e de aislamiento: el usuario B recibe 404 al pedir recursos del usuario A.
- [ ] Revisión de seguridad: validaciones, límites de tamaño, throttling, cabeceras, secretos fuera del repo.
- [ ] Lighthouse (PWA, rendimiento, accesibilidad) ≥ 90 en móvil.
- [ ] Pruebas en iPhone real: safe areas, teclado numérico, modo oscuro, arranque en frío.
- [ ] Respaldo: exportación JSON de la cuenta y verificación del restore de Neon.

---

## Cómo trabajar cada fase

1. Rama `feat/fase-N-nombre` → PR a `main` → el CI debe pasar.
2. Primero la API con sus pruebas, luego la pantalla.
3. Las reglas de dinero se escriben y prueban en `packages/shared`, nunca duplicadas en api o web.
4. Al cerrar la fase, marca las casillas de este documento.

## Riesgos y cómo mitigarlos

| Riesgo                                         | Mitigación                                                                                   |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Arranque en frío de Render (~1 min)            | Pantalla "Despertando…", caché del service worker, cron que despierta la API antes de enviar |
| Push en iOS solo con app instalada (iOS 16.4+) | Explicar en Perfil cómo instalarla; correo como canal alterno                                |
| Límite de Neon (cómputo/almacenamiento)        | Escala a cero; índices por `userId, period`; monitorear el panel de uso                      |
| Correos en spam sin dominio propio             | Correo opcional; dominio (~US$10/año) solo si hace falta                                     |
| Cron de GitHub con retrasos de minutos         | Aceptable para avisos diarios; endpoint idempotente                                          |
| Errores de fechas por zona horaria             | Toda fecha de negocio se calcula en `America/Bogota` con pruebas específicas                 |
