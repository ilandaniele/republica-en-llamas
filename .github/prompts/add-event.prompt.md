---
mode: ask
description: "Add a new EventCard to the game engine. Use when: creating new political/economic/social/crisis/law events, adding character-driven cards, or adding lifeline cards."
---

Add a new `EventCard` to República en Llamas.

## Inputs

- **Category**: ${input:category:Category — one of: political, economic, social, international, crisis, law, character, lifeline, argentina, scandal}
- **Card ID**: ${input:cardId:Unique ID in snake_case, e.g. pol_042 or eco_031}
- **Spanish title** (ALL CAPS, ≤ 6 words): ${input:titleEs:Spanish title}
- **Spanish body** (2 sentences max, present tense): ${input:bodyEs:Spanish body text}
- **Choice A** (action phrase ≤ 8 words in Spanish): ${input:choiceAEs:Choice A text}
- **Choice B**: ${input:choiceBEs:Choice B text}
- **Choice C** (optional, leave blank to skip): ${input:choiceCEs:Choice C text}
- **Choice D** (optional, leave blank to skip): ${input:choiceDEs:Choice D text}

## What to generate

### 1. EventCard object

Add to the correct array file based on category (see game-engine instructions). The card must have:
- `id`: `"${cardId}"`
- `category`: matching the category chosen
- `titleKey`: `"event.${cardId}.title"`
- `bodyKey`: `"event.${cardId}.body"`
- `choices`: each with `id: "${cardId}_a"` … `"_d"`, `textKey: "event.${cardId}.choice_a"` … `choice_d`, and balanced `effects`
- `weight`: suggest 5–8 for standard cards

Balance the effects:
- **Choice A** — orthodox/harsh: reduces a bad variable (inflation, deficit) at cost of popularity
- **Choice B** — populist: boosts popularity but makes economic vars worse
- **Choice C** — moderate (if present): smaller balanced tradeoffs
- **Choice D** — unexpected/creative (if present): novel mix

### 2. i18n keys for `packages/game-engine/src/i18n/es.ts`

```ts
'event.${cardId}.title': '${titleEs}',
'event.${cardId}.body': '${bodyEs}',
'event.${cardId}.choice_a': '${choiceAEs}',
'event.${cardId}.choice_b': '${choiceBEs}',
// choice_c and choice_d if provided
```

### 3. i18n keys for `packages/game-engine/src/i18n/en.ts`

Translate all keys to English. Titles should be ALL CAPS. Body and choices should feel like foreign press coverage of Argentina.

### 4. Instructions

- Append the card object at the bottom of the correct `*_CARDS` array constant
- Append the i18n keys to both `es.ts` and `en.ts` after the last entry for that card's category
- Do **not** modify `events/index.ts` — it imports all arrays automatically
