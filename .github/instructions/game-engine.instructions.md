---
applyTo: "packages/game-engine/**"
---

# Game Engine — Contributor Instructions

## EventCard Shape

Every card in `packages/game-engine/src/events/` must conform to `EventCard` from `types.ts`:

```ts
{
  id: string;              // unique, snake_case e.g. "pol_042"
  category: CardCategory;  // 'political' | 'economic' | 'social' | 'international' | 'crisis'
  titleKey: string;        // i18n key: "event.<id>.title"
  bodyKey: string;         // i18n key: "event.<id>.body"
  choices: Choice[];       // 2–4 choices
  weight: number;          // draw probability weight (1–10; 10 = most frequent)
  minTurn?: number;        // earliest turn the card can appear
  maxTurn?: number;        // latest turn it can appear
  requiredCrisis?: CrisisType;   // only draw when this crisis is active
  minDifficulty?: Difficulty;    // 'easy' | 'normal' | 'hard' | 'crisis'
  // Character memory system
  characterId?: CharacterId;     // 'ministro' | 'sindicalista' | 'periodista' | 'embajador' | 'gobernadora'
  memoryFlagAdded?: string;      // flag stored on character when card is drawn
  requiredFlags?: string[];      // ALL must be present on character
  forbiddenFlags?: string[];     // ANY present skips the card
  // Lifeline
  isLifeline?: boolean;          // drawn when 2+ variables in red zone
  lifelineFor?: string[];        // which variables it helps recover
  // Congressional session
  isLaw?: boolean;               // triggers congressional minigame instead of normal choice UI
}
```

## ChoiceEffect Fields

All fields are optional deltas applied to `GameState`:
```ts
popularityDelta, stabilityDelta, mediaCredibilityDelta,
inflationDelta, deficitDelta, marketConfidenceDelta,
currencyStrengthDelta, foreignReservesDelta, gdpGrowthDelta,
governmentSeatsDelta, lawsPassedDelta, emergencyDecreeDelta
```
- Positive = improves that variable (except `inflationDelta` and `deficitDelta` where positive = worse)
- Keep per-choice magnitudes in range ±5 to ±25 for standard cards; crises can go to ±35

## Which Array to Append To

| Category | File | Array constant |
|---|---|---|
| political | `events/political.ts` | `POLITICAL_CARDS` |
| economic | `events/economic.ts` | `ECONOMIC_CARDS` |
| social | `events/social.ts` | `SOCIAL_CARDS` |
| international | `events/international.ts` | `INTERNATIONAL_CARDS` |
| crisis | `events/crisis/index.ts` | `CRISIS_CARDS` |
| character-driven | `events/characters.ts` | `CHARACTER_CARDS` |
| lifeline | `events/lifelines.ts` | `LIFELINE_CARDS` |
| laws (congressional) | `events/laws.ts` | `LAW_CARDS` |
| argentina-flavor | `events/argentina.ts` | `ARGENTINA_CARDS` |
| scandals | `events/scandals.ts` | `SCANDAL_CARDS` |

All these arrays are imported and spread into `ALL_CARDS` in `events/index.ts` — no changes needed there.

## i18n Keys

After defining a card, add the strings to **both** `i18n/es.ts` and `i18n/en.ts`:
```ts
// es.ts
'event.<cardId>.title': 'TÍTULO EN MAYÚSCULAS',
'event.<cardId>.body': 'Descripción narrativa. Máximo 2 oraciones.',
'event.<cardId>.choice_a': 'Texto opción A',
'event.<cardId>.choice_b': 'Texto opción B',
'event.<cardId>.choice_c': 'Texto opción C',  // if 3+ choices
'event.<cardId>.choice_d': 'Texto opción D',  // if 4 choices
```

Titles use ALL CAPS in Spanish. Body text is present-tense journalism style. Choices are short action phrases (≤ 8 words).

## Crises

Crises are detected automatically in `crises.ts` via `detectCrises()`. The thresholds are in `constants.ts`:
```ts
CRISIS_THRESHOLDS = {
  debtCrisis:            { publicDeficit: 70, marketConfidence: 30 },
  hyperinflationSpiral:  { inflation: 40, currencyStrength: 25 },
  socialUnrest:          { socialStability: 20, popularity: 15 },
  legislativeRebellion:  { governmentSeats: 80, socialStability: 30 },
  impeachmentAttempt:    { popularity: 10, mediaCredibility: 20, socialStability: 25 },
}
```
Do not trigger crises programmatically from card effects. They auto-trigger from threshold checks.

## Difficulty Modifiers

`DIFFICULTY_MODIFIERS` in `constants.ts` scales negative effects at runtime. Cards should be balanced for `normal` difficulty — the multipliers handle the rest:
- easy: 0.5× negative effects
- normal: 1.0×
- hard: 1.3×
- crisis: 1.6×

## Testing

Tests live in `src/__tests__/`. Run with `npm test --workspace=packages/game-engine`. 
When adding a card, confirm it appears in `drawCard()` by checking no field violates the eligibility filters in `events/index.ts` (minTurn, requiredCrisis, cooldown, etc.).
