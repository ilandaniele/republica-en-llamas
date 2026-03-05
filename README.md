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
| Backend | Supabase (Auth + PostgreSQL + Edge Functions) |

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

```bash
cp .env.example .env
# Edit .env and fill in your Supabase credentials
```

Required variables:
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anonymous key
- `EXPO_PUBLIC_SUPABASE_URL` — Same URL for mobile
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` — Same anon key for mobile
- `SUPABASE_SERVICE_ROLE_KEY` — Service role key (for edge functions only)

### 3. Set up Supabase database

Option A — Supabase Dashboard:
1. Go to your Supabase project → SQL Editor
2. Paste and run the contents of `supabase/migrations/001_initial.sql`

Option B — Supabase CLI:
```bash
supabase login
supabase link --project-ref <your-project-ref>
supabase db push
```

---

## Development

### Run the web app
```bash
npm run dev --workspace=apps/web
# Opens at http://localhost:5173
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

## Supabase Edge Functions

### Serve locally
```bash
supabase functions serve validate-score --env-file .env
```

### Test
```bash
curl -X POST http://localhost:54321/functions/v1/validate-score \
  -H "Authorization: Bearer <user-jwt>" \
  -H "Content-Type: application/json" \
  -d '{"runId": "<run-id>", "claimedScore": 5000}'
```

### Deploy
```bash
supabase functions deploy validate-score
```

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
│   └── mobile/           # Expo SDK 51
└── supabase/
    ├── migrations/001_initial.sql
    └── functions/validate-score/
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

- Multiplayer realtime mode (Supabase Realtime channels)
- Achievement system
- Campaign mode with persistent world state
- Custom card creator

---

## Contributing

This is a personal project scaffold. Issues and PRs welcome.

---

*República en Llamas v0.1.0*
