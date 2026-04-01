---
agent: ask
description: "Add a new playable president character. Use when: adding a new PortraitId, creating a new pixel portrait SVG, registering the president in entitlements, and wiring their name into GameOverScreen/GameScreen."
---

Add a new playable president to República en Llamas.

## Inputs

- **Character ID** (lowercase, no spaces): ${input:characterId:e.g. kirchner, kicillof, or a fictional one like tecnoburo}
- **Full name**: ${input:fullName:e.g. Cristina Fernández de Kirchner}
- **Political alignment** (for flavor): ${input:alignment:e.g. kirchnerista, libertario, peronista, radical}
- **Entitlement pack** (which IAP unlocks this president): ${input:entitlementId:One of: presidents_pack, opposition_pack, full_access — or "free" if free tier}
- **Brief description** (for entitlement store copy, max 10 words in Spanish): ${input:description:e.g. Gobernadora que volvió con todo}
- **Portrait style notes** (hair color, distinctive features, expression): ${input:portraitNotes:e.g. pelo corto rubio, anteojos negros, traje oscuro}

## What to generate

### 1. `PortraitId` type update — `apps/web/src/components/illustrations/PixelPortrait.tsx`

Add `'${characterId}'` to the `PortraitId` union type.

### 2. New portrait function — same file

Create `function XxxPortrait({ mood }: { mood: PortraitMood })` rendering on a **120×140 SVG canvas** using only `<rect>` pixel shapes (no `<circle>`, `<ellipse>`, `<path>` except for mouth curves). Follow the existing portraits (MileiPortrait, MassaPortrait, etc.) as templates. Include:
- Background rect `0 0 120 140`
- Suit/jacket body rects
- Head rect with skin color
- Hair as pixel rect clusters
- Eyes as small rects or tiny circles
- Mood variants: `neutral` (default expression), `panic` (stress marks/sweat), `victory` (smile/raised hands feel)

Add a `case '${characterId}':` to the switch in `PixelPortrait`.

### 3. `entitlements.ts` — `packages/game-engine/src/entitlements.ts`

If the president is NOT free tier, add `'${characterId}'` to the `unlocks` array of the `${entitlementId}` product. If `entitlementId` is `"free"`, add to `FREE_TIER.presidents` array instead.

### 4. `PRESIDENT_NAMES` map — `apps/web/src/screens/GameOverScreen.tsx` and `GameScreen.tsx`

Add:
```ts
${characterId}: '${fullName}',
```
to the `PRESIDENT_NAMES` record in both files.

### 5. President select screen — `apps/web/src/screens/PresidentSelectScreen.tsx`

Check if the president needs to be added to the president list rendered there (read the file first to understand the data structure).

## Checklist

- [ ] `PortraitId` union updated
- [ ] Portrait function created and wired in switch
- [ ] Entitlement unlock registered (or free tier updated)
- [ ] `PRESIDENT_NAMES` updated in GameOverScreen
- [ ] `PRESIDENT_NAMES` updated in GameScreen (if present)
- [ ] PresidentSelectScreen updated
