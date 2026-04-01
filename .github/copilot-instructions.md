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
| Token | Use |
|---|---|
| `nightBlue` / `var(--night-blue)` | Page backgrounds |
| `celeste` / `var(--celeste)` | Argentine flag accent, government seats |
| `gold-400` / `var(--gold)` | Scores, turn counter, CTA borders |
| `crimson-*` | Politics, crises, danger |
| `smoke-*` | Text on dark backgrounds |
| `navy-*` | Card/panel backgrounds |

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

## i18n

Event card text is stored in `packages/game-engine/src/i18n/es.ts` and `en.ts` as flat key-value maps. Key format: `event.<cardId>.title`, `event.<cardId>.body`, `event.<cardId>.choice_a` … `choice_d`. Import via the re-exported `es`/`en` named exports from `@republica/game-engine`.

## Deployment (Fly.io)

`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` must be passed as Docker build args — they are baked into the bundle at Vite build time. Set them via `fly deploy --build-arg VITE_SUPABASE_URL=... --build-arg VITE_SUPABASE_ANON_KEY=...` or as Fly secrets mapped to build args.
