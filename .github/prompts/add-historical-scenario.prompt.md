---
agent: ask
description: "Add a new historical Argentina scenario to the game. Use when: adding a ScenarioId, a HISTORICAL_SCENARIOS entry, its calendar/narrative arc, and its i18n strings and event cards."
---

Add a historical Argentina scenario to República en Llamas.

## Inputs

- **Scenario id** (snake_case, with year when relevant): ${input:scenarioId:e.g. crisis_tequila_1995}
- **Scenario name**: ${input:scenarioName:e.g. Efecto Tequila}
- **Historical period**: ${input:period:e.g. 1995}
- **Central event** (one sentence): ${input:centralEvent:e.g. La crisis mexicana dispara una corrida bancaria}
- **Entitlement required** (which IAP unlocks it): ${input:entitlementId:One of: mode_historical, full_access}

Before starting, read `HISTORICAL_SCENARIOS` in `packages/game-engine/src/constants.ts` to confirm the scenario is not already there.

## What to generate

### 1. `ScenarioId` and `HISTORICAL_SCENARIOS`

Add `'${scenarioId}'` to the `ScenarioId` union in `packages/game-engine/src/types.ts`, then add a `HistoricalScenarioConfig` entry to `HISTORICAL_SCENARIOS` in `packages/game-engine/src/constants.ts`. Follow the existing entries: `labelKey`, `periodKey`, `descriptionKey`, `entitlementRequired`, and the starting stats. Base the starting stats on real data where possible — they should tell the story before the first card is drawn.

### 2. Calendar and narrative arc — `packages/game-engine/src/constants.ts`

Add a `SCENARIO_CALENDARS` entry (`startMonth`, `startYear`, `turnsPerMonth`). Optionally add a `SCENARIO_ARCS` entry whose phases (`maxTurn`, `weightedCategories`) boost the card categories that fit each stage of the period.

### 3. Scenario event cards (minimum 3)

Write 3–5 `EventCard` objects capturing the key decisions of the period. Place them in `events/argentina.ts` (the `ARGENTINA_CARDS` array).

Historical card design rules:
- At least one card that mirrors the *actual* decision made (with historically accurate effects)
- At least one card that represents the counterfactual ("what if they had done X?")
- All choices should feel period-appropriate in language

### 4. i18n keys

Add `scenario.${scenarioId}.label`, `scenario.${scenarioId}.period`, `scenario.${scenarioId}.description`, and all card strings to `i18n/es.ts` and `i18n/en.ts`. English translations should read like foreign press coverage of Argentina (Financial Times / BBC style).

### 5. Scenario picker

`apps/web/src/screens/HomeScreen.tsx` lists scenarios from `HISTORICAL_SCENARIOS`. Confirm the new entry renders and starts through `startHistoricalScenario`; no separate registry is needed.
