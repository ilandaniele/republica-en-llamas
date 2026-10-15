# República en Llamas — Propuesta de arquitectura y plan de refactor

Estado: **opción C elegida** (ver sección 5). Fase 1 hecha: pantallas en `apps/web/src/features/<feature>/` con la regla `import/no-restricted-paths`, y `replayRun` validando puntajes en la edge function `submit-run`. Lo usado por dos o más features (store del juego, `PaywallModal`, `BuyButton`, `UserMenu`, `useLeaderboard`, `useAuth`, `useEntitlements`) queda en las carpetas compartidas.

## 1. Punto de partida

| Área | Hoy |
|---|---|
| Monorepo | Turborepo + npm workspaces: `packages/game-engine` (TS puro), `apps/web` (React 18 + Vite 5), `apps/mobile` (Expo) |
| Estado cliente | Zustand (`stores/gameStore.ts`) |
| Datos servidor | Supabase (Postgres + RLS + edge functions) vía TanStack Query 5 |
| Estructura web | Por tipo de archivo: `screens/`, `components/`, `hooks/`, `stores/`, `lib/` |
| Archivos grandes | `EventIllustration.tsx` 1519 líneas, `PixelPortrait.tsx` 955, `CongressSession.tsx` 833, `GameOverScreen.tsx` 469, `GameScreen.tsx` 447 |

El motor del juego ya está bien aislado (funciones puras, tests). El problema principal está en `apps/web`: la organización por tipo mezcla features, los componentes grandes combinan render, timers, estado y reglas, y algunas reglas de negocio sensibles (puntaje, entitlements) se deciden en el cliente.

## 2. Opciones de arquitectura (2026)

### Opción A — Feature-Sliced Design (FSD v2.1)

Capas estandarizadas con dependencia solo hacia abajo: `app → pages → widgets → features → entities → shared`. Cada slice expone una API pública (`index.ts`) y no se importa entre slices de la misma capa.

```
apps/web/src/
  app/        providers, router, queryClient
  pages/      game, game-over, leaderboard, profile, auth
  widgets/    congress-session, variables-panel, event-card
  features/   make-choice, buy-entitlement, share-result
  entities/   president, run, leaderboard-entry, entitlement
  shared/     ui (pixel components), lib, api (supabase client), config
```

- **Pros:** convención documentada y reconocible; linter oficial (Steiger) para validar capas; escala bien con equipo.
- **Contras:** curva de aprendizaje; la distinción widget/feature/entity genera discusiones en un proyecto chico; mucho boilerplate de `index.ts`; el motor del juego no encaja naturalmente (queda como paquete externo a las capas).

### Opción B — Hexagonal (Ports & Adapters) con el motor como núcleo

El dominio es `@republica/game-engine`. Todo lo externo se modela como puertos (interfaces) definidos por el dominio/aplicación, y se implementa con adaptadores intercambiables.

```
packages/game-engine/        dominio puro (ya existe)
  ports.ts                   ScoreRepository, PaymentGateway, AnalyticsPort, RandomSource, Clock
apps/web/src/
  application/               casos de uso: startRun, applyChoice, finishRun, purchase
  adapters/
    supabase/                SupabaseScoreRepository, SupabaseAuth
    stripe/                  StripeCheckoutGateway (vía edge function)
    posthog/                 PosthogAnalytics
  ui/                        React (screens, components) — solo llama casos de uso
```

- **Pros:** el motor queda testeable al 100% con fakes; `RandomSource` con semilla habilita replay determinista y validación de puntaje en servidor; cambiar Supabase/PostHog/Stripe no toca la lógica.
- **Contras:** más indirección en la UI React; riesgo de sobre-ingeniería para pantallas simples; no dice cómo organizar los componentes visuales.

### Opción C — Híbrida (recomendada): núcleo hexagonal + módulos por feature (bulletproof-react)

Hexagonal **solo donde aporta** (el motor y los bordes de IO: puntaje, pagos, analytics, azar) y organización por features en la web, sin las capas extra de FSD.

```
packages/game-engine/        dominio puro + ports.ts (RandomSource, Clock)
apps/web/src/
  app/                       providers (Auth, Query, Sound), router, routes.ts, queryClient.ts
  features/
    game/                    GameScreen, CrisisScreen, EventCard, VariablesPanel, store, hooks
    congress/                CongressSession dividido: hook useCongressVote + subcomponentes
    game-over/               GameOverScreen, share, newspaper
    leaderboard/             api (queryOptions), LeaderboardScreen
    auth/                    AuthProvider, Login/Register/Profile
    monetization/            Paywall, BuyButton, entitlements api
  components/                UI compartida pixel-art (botones, bordes, barras)
  illustrations/             SVG/pixel art dividido por escena
  lib/                       supabase client, analytics, i18n
  config/                    env validado
```

Reglas:
- Una feature no importa otra feature; lo compartido sube a `components/` o `lib/` (ESLint `no-restricted-imports` / `import/no-restricted-paths`).
- Cada feature expone `index.ts`; dentro: `api/`, `components/`, `hooks/`, `model/`.
- Lógica de reglas → motor. Estado de UI → hooks/feature store. IO → `api/` de la feature.
- Routing: React Router v7 en modo SPA (migración directa desde v6) con prefetch por intención, o TanStack Router con `defaultPreload: 'intent'` si se quiere routing tipado.

**Por qué C:** el valor real de hexagonal en este proyecto está en dos lugares concretos (azar determinista para validar puntajes, y gateways de pago/analytics), no en toda la UI. Bulletproof-react da la modularidad que pide `BASE_CLAUDE.md` (archivos chicos, responsabilidades claras) con menos ceremonia que FSD.

### Comparación

| Criterio | A: FSD | B: Hexagonal | C: Híbrida |
|---|---|---|---|
| Complejidad inicial | Alta | Media-alta | Media |
| Encaje con motor existente | Bajo | Alto | Alto |
| Modularidad UI | Alta | Baja | Alta |
| Habilita validación de puntaje en servidor | No por sí sola | Sí | Sí |
| Tooling de enforcement | Steiger | ESLint | ESLint |
| Costo de migración | Alto | Medio | Medio |

## 3. Plan por fases (después de elegir)

Cada fase termina con: `npm run lint` sin errores, type-check de ambos workspaces, tests verdes, build OK.

### Fase 0 — Seguridad e integridad (independiente de la arquitectura, hacer primero)

1. **Puntajes falsificables.** El cliente inserta `score` y `completed_at` en `game_runs`. Mover el cierre de partida a una RPC/edge function que recalcule el puntaje desde la semilla + decisiones (`run_events`).
2. **Azar no determinista.** `CongressSession` usa `Math.random()`, rompiendo el replay. Introducir `RandomSource` con semilla en el motor y usarlo en todas las tiradas.
3. **`validate-score` roto y sin uso.** Reescribir sobre el punto 1 o eliminar.
4. **`hasPremium` es true con cualquier entitlement.** Corregir según el producto comprado.
5. **`checkUsernameAvailable` siempre true bajo RLS.** Usar una función `security definer` que solo devuelva existencia.
6. **Upsert de `country`** a una columna inexistente en `profiles`: agregar columna en migración o quitar el campo.
7. **Guardado duplicado de runs.** Idempotencia por `run_id` (upsert) y guardia en el cliente.

Estado (rama `fix/phase0-security`): resueltos 4, 5 (migración `005_username_available.sql`, función `security definer` que solo devuelve existencia), 6 (se quitó `country` del cliente) y la guardia de cliente de 7. En 2, las tiradas de `CongressSession` que afectan el resultado usan `createRng(seed + turn)`. Quedan 1 y 3, que requieren replay completo del motor en una edge function (incluyendo las acciones de negociación en `run_events`), y la idempotencia de 7 en servidor, que conviene resolver junto con 1.

Estado (rama `refactor/phase1-structure`): resueltos 1, 3 y 7. El store registra `runConfig` y las decisiones de cada turno; la edge function `submit-run` las reproduce con `replayRun` (bundle del motor generado con `npm run bundle:engine`) y guarda el puntaje que calcula el servidor. La migración `006_server_validated_runs.sql` quita los permisos de insert/update del cliente y agrega un índice único por usuario, semilla y decisiones. Se eliminó `validate-score`. Límite conocido: la semilla todavía la elige el cliente, así que un jugador puede probar semillas hasta encontrar una favorable.

### Fase 1 — Estructura base

- Crear `app/` (providers), `features/`, `config/env.ts` (validación de `VITE_*` con zod).
- **AuthProvider**: hoy `useAuth` abre una suscripción por cada llamada. Un solo `onAuthStateChange` en un provider + `useAuth` como lector de contexto.
- Reglas ESLint de fronteras entre features.

### Fase 2 — Migración por feature (una PR por feature)

Orden sugerido por riesgo/beneficio: `leaderboard` → `auth` → `monetization` → `game-over` → `congress` → `game`.
- `CongressSession.tsx` (833 líneas): extraer `useCongressVote` (timers con cleanup, hoy hay timers sin limpiar y `setState` dentro de updaters), y subcomponentes de hemiciclo, barra y acciones.
- `EventIllustration.tsx` (1519) y `PixelPortrait.tsx` (955): un archivo por escena/personaje + mapa de lazy imports.
- `useRunHistory`: reemplazar `select *` con eventos anidados por columnas explícitas y paginación.
- Corregir las advertencias de React Compiler (`set-state-in-effect`, `refs`, `purity`) al tocar cada archivo, y volver esas reglas a `error`.

### Fase 3 — Rendimiento y plataforma

- framer-motion `LazyMotion` + `m` (bundle inicial de motion ~34 kB → ~4.6 kB).
- Vite 8 (Rolldown) — requiere Node 20.19+ (ya fijado en `engines`).
- React 19 + React Router v7 (o TanStack Router) con preload por intención.
- Medir memoria de la pestaña con Chrome DevTools (heap snapshot) en una partida de 40 turnos; objetivo < 150 MB. Sospechosos: timers sin limpiar, GSAP sin `context.revert()`, `html2canvas`, imágenes sin `decoding="async"`/`loading="lazy"`.

## 4. Lo ya hecho en esta iteración

**Configuración y buenas prácticas**
- ESLint 9 flat config (typescript-eslint, react-hooks 7, jsx-a11y, react-refresh, prettier) con reglas de pureza del motor, prohibición de `@engine/*` y de `posthog-js` fuera del wrapper.
- Prettier (+ plugin Tailwind), EditorConfig, `.nvmrc`, Husky + lint-staged + commitlint (Conventional Commits).
- Vitest + Testing Library en web; tests smoke de analytics y leaderboard. Test de inflación desactualizado corregido (piso -20 por deflación, commit 7e1b0f1).
- Eliminados 272 archivos compilados (`.js`, `.d.ts`, `.map`) que estaban versionados dentro de `src/`.
- `CLAUDE.md` creado a partir de `BASE_CLAUDE.md` + reglas del proyecto.
- CI: job `verify` (lint, type-check, tests) antes del deploy; acción de flyctl fijada por SHA; `VITE_POSTHOG_KEY` como build arg.

**Optimización**
- Chunk de entrada: **979 kB → 195 kB** (vendors separados; posthog, html2canvas e i18n por idioma cargados bajo demanda).
- PostHog lazy con cola de eventos; i18n carga solo el idioma activo.
- Cache cliente: TanStack Query persistido en `localStorage` (solo leaderboard, 1 día, `gcTime >= maxAge`).
- Cache servidor/CDN: nginx con `immutable` de 1 año para `/assets`, `no-cache` para `index.html`, gzip, headers de seguridad y CSP en modo report-only.
- Prefetch: rutas principales en idle; leaderboard (chunk + datos) en hover/focus.
- Índices (migración `004`): `game_runs (user_id, created_at desc)`, parciales para leaderboard global y por dificultad; se quitaron índices redundantes.

**Seguridad (migración 004 y edge functions)**
- Eliminada la policy que permitía a cualquier usuario autenticado darse entitlements gratis.
- RLS con `(select auth.uid())` y `to authenticated`; `with check` en updates.
- Vista `leaderboard` sin `limit` interno (los rankings por dificultad salían incompletos).
- `create-checkout`: verifica JWT, precio desde allowlist del servidor, CORS restringido.
- `stripe-webhook`: allowlist de entitlements, exige `payment_status = paid`, devuelve 500 ante error de DB para que Stripe reintente.

**Pendiente de aplicar por el equipo**
- `supabase db push` (migración 004).
- `supabase functions deploy create-checkout stripe-webhook`; configurar `WEB_URL` como secret de las funciones (`SUPABASE_URL`/`SUPABASE_ANON_KEY` los inyecta Supabase).
- Secret `VITE_POSTHOG_KEY` en GitHub Actions.

## 5. Decisión: opción C, en versión liviana

Análisis del 2026-10-14 sobre el estado actual del repositorio:

| Dato | Valor | Efecto en la elección |
|---|---|---|
| Equipo | 1 autor (76 de 77 commits) | FSD (A) rinde con equipos que necesitan una convención compartida; acá su costo no se recupera. |
| Tamaño web | ~75 archivos, ~15 400 líneas | Por encima del umbral habitual (25–30 componentes) para pasar de carpetas por tipo a features. |
| Azar del motor | `createRng(seed …)` en `gameLoop.ts` y `congress.ts` | La parte de B que más aporta (replay determinista) ya existe sin capas extra. Queda `Math.random()` en `contextPrefixes.ts` y la semilla inicial en `gameStore.ts`. |
| Mobile | `apps/mobile` importa `@republica/game-engine` | La lógica tiene que seguir en el motor; los puertos de B en la web no ayudan a mobile. |
| Archivos grandes | `EventIllustration.tsx` 2393, `CongressSession.tsx` 1040, `PixelPortrait.tsx` 955 líneas | El dolor es de modularidad de UI, que C resuelve y B no. |

La guía publicada coincide: FSD se recomienda para apps medianas y grandes con varios equipos, y para proyectos chicos con un solo desarrollador se recomienda una estructura por features como bulletproof-react.

**Decisión:** opción C, sin crear capas hexagonales nuevas en la web:

- La web se organiza por features (`app/`, `features/<feature>/`, `components/`, `lib/`), con ESLint `import/no-restricted-paths` para que una feature no importe otra.
- No hay `application/` ni adaptadores genéricos. El único "puerto" que se agrega es la función pura de replay del motor (`replayRun(seed, decisions)`), que reutiliza la edge function que valida el puntaje (Fase 0, puntos 1 y 3).
- Antes de eso hay que quitar `Math.random()` de `contextPrefixes.ts` para que el motor sea determinista de punta a punta.

Orden: terminar el merge de los PRs abiertos, después Fase 1 (estructura y reglas ESLint) y luego Fase 2, una PR por feature.

## 6. Estado de la Fase 2 (2026-10-14)

Una PR por feature, todas apuntando a `main`:

| PR | Rama | Alcance |
|---|---|---|
| #9 | `refactor/phase2-auth` | `ProfileScreen`, `RegisterScreen` |
| #10 | `refactor/phase2-game-over` | `GameOverScreen` dividido en componentes |
| #11 | `refactor/phase2-congress` | `CongressSession` + `useCongressVote` |
| #12 | `refactor/phase2-game` | `AnibalTicker`, `EventCardComponent`, `TurnTransitionScreen` |
| #13 | `refactor/phase2-home` | pantalla de inicio |
| #14 | `refactor/phase2-illustrations` | `EventIllustration` (un archivo por escena, lazy), `PixelPortrait` (un archivo por personaje, lazy), `PresidentAvatar` por tablas |

Cierre (PR apilada sobre #9–#14): `react-hooks/set-state-in-effect`, `refs` y `purity` vuelven a `error`; `npm run lint` da 0 errores.

Pendiente fuera de la Fase 2:
- Advertencias de complejidad en el motor (`gameLoop.ts`, `crises.ts`, `events/index.ts`, `congress.ts`).
- Código muerto: `components/illustrations/presidents/{Bullrich,Massa,Milei}Caricature.tsx` y el barrel `components/illustrations/index.ts` no se importan.
- Texto con mojibake (`IlustraciÃ³n`) en `EventIllustration` y comentarios de escenas.

## 7. Estado de la Fase 3 (2026-10-15)

| PR | Rama | Alcance |
|---|---|---|
| (anterior) | — | framer-motion `LazyMotion` + `m` en `main.tsx`, features cargadas desde `lib/motionFeatures.ts` |
| #16 | `perf/vite-8` | Vite 8 (Rolldown), plugin-react 6, Vitest 4; chunks de vendors con `codeSplitting.groups`; `resolve.dedupe` de React (la raíz trae React 18 de `apps/mobile`) |
| #17 | `perf/react-19` | React 19 + React Router 7 (modo declarativo, imports desde `react-router`); `prefetchOnIntent` en `routes.ts` para precargar pantallas en hover/focus |
| #18 | `perf/memory` | Imágenes con `loading="lazy"` y `decoding="async"`; el canvas de `html2canvas` se libera después de `toBlob` |

Medición de memoria (build de producción, partida automática): el heap de JS se mantiene en 8–11 MB por turno, sin tendencia a crecer, y el DOM vuelve a ~80 elementos al salir de la partida. Muy por debajo del objetivo de 150 MB. La partida terminó en el turno 18, no en el 40. GSAP ya usaba `useGSAP` con revert automático; los dos timers sin `clear` (prefetch en idle y re-render de 2 s en `gameStore`) son de una sola vez.
