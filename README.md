# República en Llamas

A full-stack political-economic simulation card game. You are the president. Every turn, a crisis unfolds and you must decide. The republic survives or burns based on your choices.

---

## Stack

| Layer | Tech |
|-------|------|
| Monorepo | Turborepo + npm workspaces |
| Game engine | Pure TypeScript (zero UI deps) |
| Web app | React 18 + Vite + Tailwind + shadcn/ui + Framer Motion + Zustand |
| Mobile app | Expo SDK 51 + NativeWind + Reanimated |
| Backend | Cloudflare Worker (`apps/api`) + D1 (SQLite) + Better Auth |
| Hosting | Cloudflare Workers Static Assets (web build + API on one origin) |

---

## Prerequisites

> **IMPORTANT:** Node.js v22 LTS is required for the Expo mobile app.
> Download from https://nodejs.org

Verify your version:
```bash
node --version  # Should be v22.x.x
```

---

## Setup

### 1. Clone and install

```bash
cd republica-en-llamas
npm install
```

### 2. Configure environment

Web (`apps/web`), public and baked into the bundle at build time (never put secrets here):
- `VITE_POSTHOG_KEY` — PostHog project key (analytics stays off without it)
- `VITE_OFFLINE_MODE` — optional, runs the web app without the API

Mobile (`apps/mobile`):
- `EXPO_PUBLIC_API_URL` — Worker origin; the leaderboard fetches `${EXPO_PUBLIC_API_URL}/api/leaderboard`

API Worker (`apps/api`), never `VITE_*`. Local values go in `apps/api/.dev.vars` (do not commit it); deployed values are Worker secrets (`npx wrangler secret put <NAME>` from `apps/api`):
- `BETTER_AUTH_SECRET` — required, at least 32 random characters. The API answers 503 (fail closed) if it is missing or shorter
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` — optional, enables Google sign-in
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` — checkout and the Stripe webhook
- `RESET_EMAIL_FROM` and an `EMAIL` send-email binding — password reset mail; without them reset emails are skipped
- `WEB_URL` (plain var in `apps/api/wrangler.jsonc`) and optional `ALLOWED_ORIGINS` — exact allowed origins for auth and CORS

### 3. Set up the local database

D1 migrations live in `apps/api/migrations/` (append-only, numbered). Apply them to the local D1 used by `wrangler dev`:

```bash
npm run db:migrate:local --workspace=apps/api
```

---

## Development

### Run the API and the web app
```bash
npm run dev --workspace=apps/api   # wrangler dev, http://localhost:8787
npm run dev --workspace=apps/web   # Vite, http://localhost:5173, proxies /api to 8787
```

### Run the mobile app
```bash
npm run start --workspace=apps/mobile
# Scan QR code with Expo Go app
# Or press 'a' for Android, 'i' for iOS simulator
```

### Run game engine tests
```bash
npm run test --workspace=packages/game-engine
```

### Run all tests
```bash
npm test
```

### Build everything
```bash
npm run build
```

---

## API (Cloudflare Worker)

`apps/api/src/index.ts` is a single Worker that serves `/api/*` and the static web build. Routes: `start-run`, `submit-run`, `create-checkout`, `stripe-webhook`, `leaderboard`, `username-available`, `profile` (GET/PATCH), `runs` and `entitlements`. Authentication is Better Auth at `/api/auth/*` (email + password, anonymous guest sessions, optional Google).

`submit-run` replays the seed and the player's decisions with the game engine (imported directly from `@republica/game-engine`) and stores the score it computes, so the client never sends a score. Prices, entitlements and scores are always decided server-side.

Static assets come from `apps/web/dist` via Workers Static Assets with SPA fallback. `/api/*` and `/assets/*` run the Worker first; a missing hashed asset returns 404, never the SPA HTML. Security headers live in `apps/web/public/_headers`.

### Test
```bash
npm test --workspace=apps/api
npm run test:security
```

### Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`: verify, build the web app (`VITE_POSTHOG_KEY`), `npm run db:migrate` (remote D1), then `npm run deploy --workspace=apps/api`. Required GitHub secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` (and `VITE_POSTHOG_KEY` for analytics).

Manual deploy:
```bash
npm run db:migrate   # wrangler d1 migrations apply republica-en-llamas --remote
npm run deploy       # build web, then wrangler deploy
```

Live URL: https://republica-en-llamas.ilandaniele.workers.dev

External callbacks:
- Google OAuth redirect URI: `<url>/api/auth/callback/google`
- Stripe webhook endpoint: `<url>/api/stripe-webhook`

---

## Project Structure

```
republica-en-llamas/
├── package.json          # Root workspace config
├── turbo.json            # Turborepo pipeline
├── tsconfig.base.json    # Shared TS config
├── .env.example          # Environment template
├── packages/
│   └── game-engine/      # Pure TS game logic
│       └── src/
│           ├── types.ts
│           ├── constants.ts
│           ├── inflation.ts
│           ├── congress.ts
│           ├── scoring.ts
│           ├── crises.ts
│           ├── gameOver.ts
│           ├── shocks.ts
│           ├── gameLoop.ts
│           ├── events/   (60 cards in 4 categories + 5 crisis sets)
│           ├── i18n/     (ES + EN translations)
│           └── __tests__/
├── apps/
│   ├── web/              # Vite + React 18
│   ├── api/              # Cloudflare Worker (routes, Better Auth, D1 migrations)
│   │   ├── src/
│   │   ├── migrations/0001_init.sql
│   │   └── wrangler.jsonc
│   └── mobile/           # Expo SDK 51
```

---

## Game Mechanics

### Objective
Survive 50 turns as president. Each turn presents an event card requiring a decision. Survive all 50 turns to win.

### Variables
- **Popularity** (0-100) — public support; drops below 5 for 3 turns = game over
- **Social Stability** (0-100) — reaches 0 = game over
- **Media Credibility** (0-100) — affects spin effectiveness
- **Inflation** (0-200) — exceeds 150 = game over
- **Public Deficit** (0-100%) — drives inflation and crises
- **Market Confidence** (0-100) — affects foreign investment
- **Currency Strength** (0-100) — affects import costs
- **Foreign Reserves** (0-100) — reaches 0 + low confidence = bankrupt

### Crises
Crises trigger when variable thresholds are crossed simultaneously. Each crisis has a limited turns countdown. Fail to resolve = game over.

| Crisis | Triggers | Turns to resolve |
|--------|---------|-----------------|
| Debt Crisis | Deficit ≥ 70% AND Confidence ≤ 30 | 4 |
| Hyperinflation Spiral | Inflation ≥ 40% AND Currency ≤ 25 | 3 |
| Social Unrest | Stability ≤ 20 AND Popularity ≤ 15 | 5 |
| Legislative Rebellion | Gov. Seats ≤ 80 AND Stability ≤ 30 | 3 |
| Impeachment Attempt | Popularity ≤ 10 AND Credibility ≤ 20 AND Stability ≤ 25 | 3 |

### Congress negotiations
When a law requires a vote and you lack majority:
- **Political Deal** → -5 popularity, +20% independent support
- **Budget Concession** → +3% deficit, +30% independent support
- **Emergency Decree** → Law passes automatically; +1 decree counter (>2 = instability penalty)
- **Coalition Building** → -8 popularity, -5 stability, +15 gov. seats for 3 turns

### Scoring
```
score = turn × 100
      + popularity × 2
      + stability × 1.5
      + market_confidence × 1.5
      + laws_passed × 50
      - emergency_decrees × 75
      - inflation × 10
      - deficit × 5
```

---

## V2 Roadmap (scaffolded but not active)

- Multiplayer realtime mode (Cloudflare Durable Objects / WebSockets)
- Achievement system
- Campaign mode with persistent world state
- Custom card creator

---

## Contributing

This is a personal project scaffold. Issues and PRs welcome.

---

*República en Llamas v0.1.0*
