# Continuación con Claude — 8 de noviembre de 2026

Leer primero `CLAUDE.md`, después este archivo y `security_best_practices_report.md`.

## 2026-11-09 — Cloudflare migration (current state)

Branch `feat/cloudflare-migration`. Supabase and Fly.io were removed entirely. Everything below this section that mentions Supabase, Fly, nginx, Docker, Edge functions or migrations 001-011 is **historical** (state on 2026-11-08) and kept for context only. Do not follow its deployment steps.

### What changed

- Backend is `apps/api/`: one Cloudflare Worker (`apps/api/src/index.ts`) serving `/api/*` (start-run, submit-run, create-checkout, stripe-webhook, leaderboard, username-available, profile GET/PATCH, runs, entitlements) and Better Auth 1.7 at `/api/auth/*` (email + password, anonymous guest plugin, optional Google).
- The web build (`apps/web/dist`) is served by Workers Static Assets with SPA fallback. `/api/*` and `/assets/*` run the Worker first; a missing hashed asset returns 404 instead of SPA HTML.
- Database is Cloudflare D1 `republica-en-llamas`. Migrations are in `apps/api/migrations/` (`0001_init.sql`, applied remotely). It started from zero data: no Supabase data was migrated.
- Live URL: https://republica-en-llamas.ilandaniele.workers.dev
- Web uses `apps/web/src/lib/api.ts` (`apiSend`, `isOfflineMode`) and `apps/web/src/lib/auth.ts` (better-auth/react client). `useAuth` is the Better Auth session; anonymous sessions count as signed out. Security headers are in `apps/web/public/_headers` (CSP still report-only, HSTS, etc.).
- Mobile leaderboard fetches `${EXPO_PUBLIC_API_URL}/api/leaderboard`. Mobile type-check was not run.
- Only `VITE_POSTHOG_KEY` and `VITE_OFFLINE_MODE` remain as `VITE_*` vars (public, baked at build).
- `scripts/generate-images.ts` still uses Supabase Storage. It is offline tooling and was left as is.

### Commands

```sh
npm run dev --workspace=apps/api            # wrangler dev, port 8787; web vite dev proxies /api to it
npm run db:migrate:local --workspace=apps/api
npm run db:migrate                          # remote D1
npm run deploy                              # build web + wrangler deploy
npm run test:security                       # apps/api vitest + load/k6 harness tests
```

Deploy: `.github/workflows/deploy.yml` on push to `main` builds web (`VITE_POSTHOG_KEY`), runs `npm run db:migrate`, then `npm run deploy --workspace=apps/api`.

### Security finding fixed in this branch

With no `BETTER_AUTH_SECRET`, the deployed Worker used Better Auth's public default secret, which allows session forgery. Fix: `createAuth` throws if the secret is shorter than 32 characters and the API answers 503 (fail closed). A random 48-byte secret was set with `wrangler secret put`. Also fixed: a missing `/assets/*.js` returned 200 with SPA HTML. Tests: `apps/api/src/__tests__/api.test.ts` (15 tests). Details in `security_best_practices_report.md`.

### Verification (local, plus live smoke)

- Lint 0 errors. Type-check passes for game-engine, web and api.
- Tests: engine 252/252, web 613/613, api 15/15. `npm run test:security` passes. Web build OK.
- Live smoke on the workers.dev URL: `/` 200, `/api/leaderboard` `[]`, `/api/profile` 401, `/api/auth/get-session` null, `/api/nope` 404, home renders with no console errors.
- Local tests do not prove remote configuration (secrets, Google/Stripe dashboards, email binding, headers behind the real edge). Those need checking on the deployed Worker.

### Owner leftovers (manual)

1. Decommission the Fly app and the Supabase project (the INACTIVE project mentioned in the historical notes below is no longer needed).
2. Add GitHub secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` (plus `VITE_POSTHOG_KEY` if analytics is wanted) so the deploy job works.
3. Set the remaining Worker secrets with `wrangler secret put`: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`. Password-reset mail also needs `RESET_EMAIL_FROM` and an `EMAIL` send-email binding (names in `apps/api/src/env.ts`); without them reset emails are skipped. `BETTER_AUTH_SECRET` is already set.
4. Google OAuth redirect URI: `<url>/api/auth/callback/google`. Stripe webhook endpoint: `<url>/api/stripe-webhook`.
5. Two probe guest users from smoke tests exist in D1; delete them if a clean table is wanted.
6. Still open from before: CSP enforcement, `tar` advisory under Expo tooling, mobile type errors.

## Estado del proyecto (histórico, 2026-11-08)

Rama de trabajo: `feat/casa-rosada-diorama`. Motor TypeScript puro, web React 19/Vite 8, Supabase Edge/Postgres. La app móvil se conserva sin cambios funcionales de esta iteración.

Quedaron integrados el diorama animado y sus imágenes, doce personajes, agendas y escenarios, mejoras de fuentes, Congreso, inflación, debate presidencial, escrutinio con mapa real y modo Carrera: intendente → gobernador → ministro nacional → presidente. Carrera permite elegir tres cargos iniciales y guarda progreso local, fuera del ranking competitivo.

Las imágenes necesarias para jugar están en `apps/web/public/illustrations/` y las fuentes locales/licencias en `apps/web/public/fonts/`. Los originales de `art/raw/`, cachés, node_modules, builds y resultados temporales permanecen locales e ignorados; no hacen falta para ejecutar la web. No modificar `art/prompts.json` ni `art/PROMPTS.md` sin un pedido nuevo.

## Preparar y probar

Usar Node de `.nvmrc` y npm workspaces desde la raíz:

```sh
npm ci --legacy-peer-deps
npm run playtest --workspace=apps/web
```

Playtest abre en `http://127.0.0.1:5174/`. Es un modo de desarrollo sin tickets, compras reales, ranking remoto ni analytics. Producción no habilita esas excepciones. Milei, Massa y Kicillof son gratuitos; los demás requieren compra según las reglas compartidas.

Verificaciones:

```sh
npm run lint
npm run type-check --workspace=packages/game-engine
npm run type-check --workspace=packages/ui
npm run type-check --workspace=apps/web
npm test
npm run test:security
npm run verify:content
npm run build
```

Último resultado previo al commit: 252 pruebas del motor, 626 web y 46 de seguridad/SQL/harness, 924 en total. Los tipos de motor/UI/web y el build global pasan. `npm run type-check` global conserva tres errores anteriores en móvil: tipos de propiedades de analytics y referencia inexistente `restoreFromTurn`. No confundir el build global con un build de Expo: móvil no define tarea `build`.

(Histórico: `test:security` ahora ejecuta `apps/api` con vitest más los tests del harness de carga; ya no usa PGlite ni bundle de Edge functions.) `test:security` genera un bundle nuevo del motor antes de ejecutar handlers con servicios externos simulados y SQL real en PGlite. No necesita Docker. Sin k6 se omiten explícitamente tres guard-tests; con k6 también puede correrse `npm run test:load`. Los seis perfiles cortos pasaron con 1.354 solicitudes locales; no prueban capacidad real de Supabase, navegador ni nginx. No se ejecutó soak de dos horas.

## Seguridad y orden de publicación (histórico, superado por la migración a Cloudflare)

> **Superseded 2026-11-09.** Supabase, Fly.io, the 010/011 migrations and the Edge-function deploy order below no longer apply: the backend is now a Cloudflare Worker + D1 (see the Cloudflare migration section at the top). Kept as history.

Estado al 9 de noviembre de 2026: PR #39 mergeado y web desplegada en Fly por GitHub Actions (CI y Deploy en verde). **No se aplicaron migraciones 010/011 ni se desplegaron funciones**: el proyecto Supabase `djlamsrefnyforzhjeip` está INACTIVE (pausado) y debe restaurarlo el dueño. Hasta entonces la web nueva corre contra funciones viejas. Escaneo público Cloudflare Radar `b1210dfb-3147-4c30-ba87-c4c3db8c39b0`: 0 riesgos; 3 violaciones CORS de fuentes Google causadas por la cabecera `signature-input` del propio escáner, no por el sitio.

Antes de publicar el backend:

1. Revisar y aplicar `supabase/migrations/010_api_security.sql` en staging antes de desplegar las funciones que usan sus RPC. Sin esos RPC, los limitadores nuevos fallan cerrado con 503. Aplicar después `011_ticket_caps_and_private_usernames.sql` antes de desplegar `start-run` y `claim-run-ticket`: cambia las firmas de `issue_run_ticket`/`claim_run_ticket` (cupo gratuito de 3, tickets reclamados, usernames neutros).
2. Configurar orígenes exactos, límites de Supabase Auth y cabecera IP saneada por el gateway. No confiar en un `X-Forwarded-For` arbitrario. Programar limpieza administrativa de contadores.
3. Agregar la URL exacta `/reset-password` a la allowlist de Supabase y probar expiración, uso único y revocación de sesiones. La UI no configura el vencimiento del servidor.
4. Desplegar funciones con el bundle actual del motor y verificar JWT del gateway y firma Stripe. Después probar web, dos cuentas, compras en modo test, tickets y replay.

CSP permanece report-only; su enforcement requiere pruebas publicadas. Los tokens de la SPA siguen administrados por Supabase en Web Storage según Recordarme, no son HttpOnly. La dependencia `tar` del toolchain de Expo/cacache conserva un aviso crítico; no se forzaron upgrades mayores de Expo. Quedan cinco avisos en el reporte acotado a web, sin críticos, y 71 en el reporte global de la última auditoría.

## Claude Security oficial (histórico)

> The F1-F4 findings below were raised against the Supabase code. Their fixes (migration 011, `start-run`/`claim-run-ticket`) were removed with Supabase. Server-side daily ticket caps (3 free, 30 with `full_access`) exist in `apps/api/src/tickets.ts`; neutral usernames for Google sign-in and guest ticket claiming were not re-verified against the Worker. Re-verify before treating F1-F4 as closed.

Se ejecutó el pipeline oficial completo con esfuerzo medio tras aceptación expresa del coste. Informe y artefactos en `CLAUDE-SECURITY-20261108-065217/`: Markdown, JSONL, SARIF y sello `2664bccc7212-dirty`. Se incluyen expresamente en el commit para que estén disponibles al abrir el repo en otro entorno; la carpeta mantiene su `.gitignore` original.

El renderer registra `verified`, 32/32 investigadores retornados y cuatro hallazgos bajos. Son tres causas aún pendientes:

- F1: username OAuth derivado del email puede exponer su parte local en el ranking.
- F2/F3: la antigüedad de tickets invitados permite eludir el cupo al reclamarlos; dos ubicaciones de una misma causa.
- F4: el cupo gratuito de tres partidas depende de localStorage y no coincide con el límite general de 30 tickets del servidor.

Ese informe describe el árbol **antes de este commit**, incluyendo cambios locales; el hash antiguo de su sello es evidencia histórica, no una afirmación de haber auditado el commit de entrega. No se aplicaron sus parches. La cobertura no garantiza lectura de todos los archivos nuevos sin seguimiento. Arte, configuración local y docs fueron apartados; varios archivos de contenido/tests/salidas solo se buscaron parcialmente. El escaneo fue estático, sin exploits ni tráfico al backend.

STRIX quedó excluido por el usuario: no ejecutarlo. No repetir el escaneo costoso por rutina; ya hay resultados para trabajar. Si se necesita otra ejecución en esta máquina, el Python real existe, pero sus alias de Windows pueden estar rotos; el último escaneo usó un launcher temporal por proceso, sin cambiar PATH global.

## Documentación de apoyo

- `docs/playtest.md`: recorridos para probar.
- `docs/carrera-politica.md`, `docs/debate-presidencial.md`, `docs/escrutinio-presidencial.md`: reglas y verificación de las funciones nuevas.
- `docs/security/backend-audit.md`, `frontend-audit.md`, `testing-audit.md`: cambios, pruebas y límites.
- `docs/architecture-plan.md`: decisión previa C, híbrida liviana; no migrar toda la arquitectura sin un pedido nuevo.
- `docs/buenas-practicas-2026-11-08.md`: auditoría previa; algunas cifras son antecedentes y quedan superadas por este cierre.

La revisión visual real en navegador y los servicios publicados siguen pendientes (nginx/contenedor ya no existen tras la migración a Cloudflare). No describirlos como probados por los tests jsdom ni por las mediciones de loopback.
