---
agent: ask
description: "Add a historical Argentina scenario to the game. Use when: implementing Hiperinflación 1989, Corralito 2001, Convertibilidad, Rodrigazo 1975, Malvinas 1982, or Kirchnerismo boom 2003-2007 as playable scenarios."
---

Add a historical Argentina scenario to República en Llamas.

## Inputs

- **Scenario name**: ${input:scenarioName:e.g. Hiperinflación 1989, El Corralito, La Convertibilidad, El Rodrigazo, Malvinas, Kirchnerismo Boom}
- **Historical period**: ${input:period:e.g. 1989, 2001, 1991-2001, 1975, 1982, 2003-2007}
- **Central event** (one sentence): ${input:centralEvent:e.g. La inflación supera el 3000% anual y el presidente renuncia}
- **Special mechanic** (what makes this scenario unique): ${input:specialMechanic:e.g. La inflación se acelera x3 cada turno; Reservas congeladas; $1=USD$1 pero reservas drenan}
- **Entitlement required** (which IAP unlocks it): ${input:entitlementId:One of: mode_historical, full_access}

## What to generate

### 1. Starting state config

A `DifficultyPreset`-style object reflecting the historical starting conditions. Base it on real data where possible. For reference, normal difficulty starts are:
- Easy: popularity 70, inflation 8, deficit 25, marketConfidence 60
- Normal: popularity 55, inflation 15, deficit 40, marketConfidence 45
- Hard: popularity 40, inflation 25, deficit 55, marketConfidence 30
- Crisis: popularity 25, inflation 40, deficit 70, marketConfidence 15

Historical presets should have distinctive starting values that tell the story before the first card is drawn.

### 2. Scenario-specific Shock entries

Add 2–3 `Shock` entries to `packages/game-engine/src/shocks.ts` with historically evocative names and effects appropriate to the era. Example for Hiperinflación:
```ts
{ id: 'shock_hiper_89', name: 'Saqueos Generalizados', turnsRemaining: 3,
  inflationMod: 15, marketConfidenceMod: -20, deficitMod: 5, popularityMod: -25 }
```

### 3. Scenario event cards (minimum 3)

Write 3–5 `EventCard` objects capturing the key decisions of the period. Place them in `events/argentina.ts` (the `ARGENTINA_CARDS` array). Use `minDifficulty` if the cards are scenario-specific and shouldn't appear in normal play.

Historical card design rules:
- At least one card that mirrors the *actual* decision made (with historically accurate effects)
- At least one card that represents the counterfactual ("what if they had done X?")
- All choices should feel period-appropriate in language

### 4. i18n keys

Add all card strings to `i18n/es.ts` and `i18n/en.ts`. English translations should read like foreign press coverage of Argentina (Financial Times / BBC style).

### 5. Read `apps/web/src/screens/PresidentSelectScreen.tsx` first

Check how historical scenarios are listed and add the new scenario following the same pattern. If a scenario list/registry doesn't exist yet, create a minimal one using an array of objects `{ id, label, period, entitlementRequired }`.

## Historical scenario reference

| Scenario | Period | Starting inflation | Key mechanic |
|---|---|---|---|
| Hiperinflación 1989 | 1989 | 200% (accelerating) | Inflation ×3 per turn |
| El Corralito | 2001 | 35% | foreignReserves frozen at 0, popularityDelta multiplied |
| La Convertibilidad | 1991–2001 | 0% | inflationDelta always 0 but foreignReserves drain every turn |
| El Rodrigazo | 1975 | 50% | One guaranteed shock on turn 1 wiping popularity by 40 |
| Malvinas | 1982 | 100% | Popularity spikes turn 1–3, then collapses from turn 4 |
| Kirchnerismo Boom | 2003–2007 | 8% | All positive effects ×1.5 for turns 1–8, then reversal |
