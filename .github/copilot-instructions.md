# República en Llamas — Workspace Instructions

## Project Layout

Turborepo monorepo. Three packages:
- `packages/game-engine/` — pure TypeScript, no React. Exports types + pure functions. Entry: `src/index.ts`.
- `apps/web/` — React 18 + Vite + Tailwind. The playable web game.
- `apps/mobile/` — Expo/React Native. Do not modify unless explicitly asked.

`@republica/game-engine` is resolved as a workspace alias. It exports TypeScript source directly (no compile step needed for the web app because Vite resolves it via the `paths` alias).

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

This project uses a **pixel-art aesthetic**. Follow these rules strictly:

### Fonts
- Headlines / labels / buttons: `font-serif` (resolves to `'Press Start 2P'`) — keep font-size ≤ 10px
- Body / narrative text: `font-mono` (resolves to `'VT323'`) — font-size 16–20px is readable
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
- **Never use `rounded-*` Tailwind classes** — `border-radius: 0 !important` is applied globally in `theme.css`
- **`image-rendering: pixelated`** is applied globally; don't override it

### Animations (Tailwind `animate-*` utilities)
`ticker-scroll`, `pixel-float`, `pixel-rise`, `pixel-confetti`, `blink-star`, `pixel-fire`, `crisis-ticker-flash`, `crowd-enter`, `colectivo-move`, `idle-look`, `dolar-float-up`

## Illustrations / SVG Components

All pixel SVG components live in `apps/web/src/components/illustrations/` and are re-exported from `./index.ts`.

Available pixel components: `PixelMate`, `PixelAsado`, `PixelFuego`, `PixelDolar`, `PixelColectivo`, `BuenosAiresBackground`, `PixelPortrait`.

`BuenosAiresBackground` is `fixed inset-0 z-0 pointer-events-none opacity-15` — always render it as the first child of the root game div.

## Component Conventions

- Framer Motion is used for enter/exit animations. Use `<AnimatePresence mode="wait">` around card transitions.
- Screen components live in `apps/web/src/screens/`. Route-level lazy loading via `React.lazy` is configured in `App.tsx`.
- `useAuth` → Supabase session. `useEntitlements` → IAP unlock status. Both are in `apps/web/src/hooks/`.

## Narrative Arc

Each run has a 4-phase arc. Use `gameState.turn` and `minTurn`/`maxTurn` on cards to enforce this pacing:

| Turns | Phase | Design intent |
|---|---|---|
| 1–5 | Establishment | Meet characters, easy decisions, build habits |
| 6–12 | Complication | Consequences of early decisions surface |
| 13–20 | Crisis | Betrayed characters return, compounding pressure |
| 20+ | Survival | Pure endurance — no mercy |

Lifelines are guaranteed every N turns per `DIFFICULTY_MODIFIERS.lifelineGuaranteeEvery` (easy=3, normal=6, hard=10, crisis=99).

## Analytics

PostHog is wired in `apps/web/src/lib/analytics.ts`. Every user action that changes state must fire a typed `track*()` function from that file — never call `posthog.capture()` directly in components.

Key funnels already instrumented:
- `game_started` → `turn_completed` (×N) → `game_over`
- `game_over` → `paywall_shown` → `purchase_started` → `purchase_completed`
- `game_over` → `share_clicked`

For A/B tests: use `posthog.getFeatureFlag('flag_name')` — never branch on raw `Math.random()` for UX experiments. Always fire `$experiment_started` on component mount when a flag is read.

## i18n

Event card text is stored in `packages/game-engine/src/i18n/es.ts` and `en.ts` as flat key-value maps. Key format: `event.<cardId>.title`, `event.<cardId>.body`, `event.<cardId>.choice_a` … `choice_d`. Import via the re-exported `es`/`en` named exports from `@republica/game-engine`.

## Deployment (Fly.io)

`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` must be passed as Docker build args — they are baked into the bundle at Vite build time. Set them via `fly deploy --build-arg VITE_SUPABASE_URL=... --build-arg VITE_SUPABASE_ANON_KEY=...` or as Fly secrets mapped to build args.

## GSAP Animations

This project uses **framer-motion** for most transitions (card enter/exit, AnimatePresence). When the user requests advanced scroll-linked animation, timeline sequencing, or complex multi-step effects, prefer **GSAP** over raw CSS or chained framer delays.

**Imports and registration — always do this once, at the top of the file:**
```ts
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
```

**Key rules:**
- **Sequencing:** prefer `gsap.timeline()` over chained `delay` values. Use position parameter (`"+=0.2"`, `"<"`, label) to place tweens.
- **Transforms:** use GSAP aliases `x`, `y`, `scale`, `rotation`, `xPercent`, `yPercent` — never animate raw `transform` or layout properties (`top`, `left`, `width`, `height`) for movement/scale.
- **Opacity:** use `autoAlpha` instead of `opacity` so elements get `visibility: hidden` at 0 and don't block clicks.
- **Multiple from() on same element:** set `immediateRender: false` on later tweens to avoid overwriting end state.
- **React:** use `useGSAP()` from `@gsap/react` (register once: `gsap.registerPlugin(useGSAP)`). Pass `{ scope: containerRef }` so selectors are scoped. Do NOT call `gsap.to()` inside plain `useEffect` without context cleanup.
- **Cleanup:** on unmount, `useGSAP` handles it automatically. If using `gsap.context()`, return `() => ctx.revert()` from `useEffect`.
- **ScrollTrigger:** attach to timeline or top-level tween, never to a child tween inside a timeline. Use `scrub` for scroll-linked progress OR `toggleActions` for discrete — not both. Call `ScrollTrigger.refresh()` after DOM layout changes.
- **clearProps:** use when CSS classes should take over after a tween completes (e.g. `gsap.to(el, { x: 100, clearProps: "x" })`).
- Path-specific detail in `.github/instructions/gsap-react.instructions.md` and `gsap-scrolltrigger.instructions.md`.
