# VM-Finance — notas para asistentes de código

- Monorepo npm workspaces: `packages/shared` (tipos + reglas financieras), `apps/api` (NestJS 12 + Prisma 7, ESM), `apps/web` (Angular 22 PWA + Tailwind 4).
- `@vm-finance/shared` se compila a `dist/`; los scripts raíz lo construyen antes de api/web.
- Dinero: siempre enteros en COP (`Cop = number`), nunca Float. Formato con `formatCop` (`$ 45.408`). Zona horaria `America/Bogota`.
- Las fórmulas de KPIs viven SOLO en `packages/shared/src/kpis.ts` y se usan en api y web. Los datos de septiembre 2026 deben dar Disponible `$ 45.408` y Ahorro neto `$ 4.652.444`.
- Multi-usuario: toda consulta filtra por `userId` tomado del JWT.
- Sin aprobación por correo (descartada). Recordatorios por Web Push + correo opcional (Brevo API HTTP, no SMTP).
- Imports relativos en la API llevan extensión `.js` (ESM nodenext).
- TypeScript estricto, sin `any`.
- Plan de trabajo: `docs/PLAN-MVP.md`.
