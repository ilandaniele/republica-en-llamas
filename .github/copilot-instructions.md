# República en Llamas — Workspace Instructions

## Project Layout

Turborepo monorepo. Three packages:
- `packages/game-engine/` — pure TypeScript, no React. Exports types + pure functions. Entry: `src/index.ts`.
- `apps/web/` — React 19 + Vite 8 + Tailwind. The playable web game.
- `apps/mobile/` — Expo/React Native. Do not modify unless explicitly asked.

`@republica/game-engine` is an npm workspace package whose `main` and `exports` point at `src/*.ts`, so the web app consumes TypeScript source with no compile step.

## Game Engine Rules

- Never import from `@engine/*` path alias in screens or components — use `@republica/game-engine` only.
- `getAnibalLine(gameState)` should **not** be called inline in JSX. Use `<AnibalTicker isCrisis={hasCrisis} />` which is fixed-position and handles its own store subscription.
- `GameState` is immutable — always spread to update: `{ ...state, political: { ...state.political, popularity: x } }`.
- All game logic lives in `packages/game-engine/src/`. The web app only reads state via `useGameStore`.

## Zustand Store

`useGameStore` is at `apps/web/src/stores/gameStore.ts`. Always subscribe to individual slices:
```ts
// ✅ correct — only re-renders when gameState changes
const gameState = useGameStore((s) => s.gameState);

// ❌ wrong — re-renders on every store change
const store = useGameStore();
```

## Design System — Pixel Art

This project uses a pixel-art aesthetic.

### Fonts
- Headlines / labels / buttons / narrative: local Pixelify Sans, weights 400–700 (`var(--font-readable)`); use readable sizes, typically 16–22px.
- Logo: local Press Start 2P. Avoid tiny text and synthetic italics for Spanish accents.
- Legacy Playfair Display: `font-classic`
- Legacy JetBrains Mono: `font-code`

### Colors (Tailwind tokens)
| Token | Hex | Use |
|---|---|---|
| `nightBlue` / `var(--night-blue)` | `#0D1B2A` | Page backgrounds — BA de noche |
| `celeste` / `var(--celeste)` | `#74ACDF` | Argentine identity, government seats |
| `gold-400` / `var(--gold)` | `#F6B40E` | Scores, achievements — Sol de Mayo |
| `crimson-*` | `#CC2200` | **Crisis only — never decorative** |
| `smoke-*` | — | Text on dark backgrounds |
| `navy-*` | — | Card/panel backgrounds |

**Color discipline rules:**
- Maximum 5–6 base colors + luminosity variants — never add new base colors
- `crimson`/`var(--crisis-red)` is reserved **only** for crisis states
- Celeste = identity/government; Gold = achievement/success
- Always pair color with shape or icon for accessibility (never color alone)

### CSS Classes
Apply these instead of inline styles:
- `.pixel-border` — 2px solid celeste-dark, no border-radius
- `.pixel-border-gold` — 2px solid gold
- `.pixel-border-crisis` — 2px solid crisis-red, crimson background tint
- `.pixel-bar-container` / `.pixel-bar-fill` — segmented stat bars; add `.bar-critical`, `.bar-warning`, or `.bar-good`
- `.pixel-choice-card` — event choice option; add `.selected` when chosen
- `.ticker-container` / `.ticker-text` — bottom news ticker
- `.glow-celeste` — box-shadow glow in celeste

### Global Rules
- `border-radius: 0 !important` is applied globally in `theme.css`, so `rounded-*` classes have no effect — don't add them
- **`image-rendering: pixelated`** is applied globally; don't override it

### Animations (Tailwind `animate-*` utilities)
`ticker-scroll`, `pixel-float`, `pixel-rise`, `pixel-confetti`, `blink-star`, `pixel-fire`, `crisis-ticker-flash`, `crowd-enter`, `colectivo-move`, `idle-look`, `dolar-float-up`

## Illustrations / SVG Components

All pixel SVG components live in `apps/web/src/components/illustrations/` and are re-exported from `./index.ts`.

Check `index.ts` for the current list of components before creating a new one.

`BuenosAiresBackground` positions itself (fixed, full-screen, `z-0`, no pointer events, 15% opacity) — render it as `<BuenosAiresBackground />` with no props, as the first child of the root game div.

## Component Conventions

- Framer Motion is used for enter/exit animations. Use `<AnimatePresence mode="wait">` around card transitions.
- Screens live in `apps/web/src/features/<feature>/`; code shared by two or more features stays in `components/`, `hooks/`, `stores/` and `lib/`. A feature never imports another feature (ESLint `import/no-restricted-paths`). Route-level lazy loading and idle/hover prefetch live in `apps/web/src/app/routes.ts`.
- `useAuth` → Better Auth session (`lib/auth.ts`; anonymous guest sessions count as signed out). Server calls go through `lib/api.ts` (`apiSend`, `isOfflineMode`). `useEntitlements` → IAP unlock status. Both are in `apps/web/src/hooks/`.

## Narrative Arc

Each run has a 4-phase arc. Use `gameState.turn` and `minTurn`/`maxTurn` on cards to enforce this pacing:

| Turns | Phase | Design intent |
|---|---|---|
| 1–5 | Establishment | Meet characters, easy decisions, build habits |
| 6–12 | Complication | Consequences of early decisions surface |
| 13–20 | Crisis | Betrayed characters return, compounding pressure |
| 21+ | Survival | Pure endurance — no mercy |

Lifelines are guaranteed every N turns per `DIFFICULTY_MODIFIERS.lifelineGuaranteeEvery` in `packages/game-engine/src/constants.ts`.

## Analytics

PostHog is wired in `apps/web/src/lib/analytics.ts`. Every user action that changes state must fire a typed `track*()` function from that file — never call `posthog.capture()` directly in components.
Key funnels already instrumented:
- `game_started` → `turn_completed` (×N) → `game_over`
- `game_over` → `paywall_shown` → `purchase_started` → `purchase_completed`
- `game_over` → `share_clicked`

For A/B tests: use `getFeatureFlag('flag_name')` from `lib/analytics.ts` (posthog-js is lazy-loaded; never import it in components) — never branch on raw `Math.random()` for UX experiments. Always call `trackExperimentStarted({ experiment, variant })` on component mount when a flag is read.

## i18n

Event card text is stored in `packages/game-engine/src/i18n/es.ts` and `en.ts` as flat key-value maps. Key format: `event.<cardId>.title`, `event.<cardId>.body`, `event.<cardId>.choice_a` … `choice_d`. Import via the re-exported `es`/`en` named exports from `@republica/game-engine`.

## Deployment (Cloudflare Workers)

One Worker (`apps/api`) serves `/api/*` and the static web build (`apps/web/dist`, Workers Static Assets with SPA fallback). Pushing to `main` runs `.github/workflows/deploy.yml`: build web, `npm run db:migrate` (D1), `npm run deploy --workspace=apps/api`. Manual: `npm run deploy`.

Only `VITE_POSTHOG_KEY` and `VITE_OFFLINE_MODE` are `VITE_*` vars. They are public and baked into the bundle at Vite build time — never put secrets in them. Server secrets (`BETTER_AUTH_SECRET`, Google, Stripe, email) are Worker secrets set with `wrangler secret put`; see `apps/api/src/env.ts`. Deploy needs GitHub secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.

## GSAP Animations

framer-motion handles card enter/exit (`AnimatePresence`). GSAP (`gsap`, `@gsap/react`) handles timeline sequencing and multi-element choreography. React rules live in `.github/instructions/gsap-react.instructions.md`; ScrollTrigger rules live in `gsap-scrolltrigger.instructions.md`.
