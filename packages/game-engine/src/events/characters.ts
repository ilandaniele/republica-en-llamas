import type { EventCard } from '../types.js';

export const CHARACTER_CARDS: EventCard[] = [
  // ─── Ministro (Rodrigo Paredes) ──────────────────────────────────────────
  {
    id: 'char_min_001',
    category: 'economic',
    titleKey: 'event.char_min_001.title',
    bodyKey: 'event.char_min_001.body',
    weight: 6,
    minTurn: 2,
    maxTurn: 8,
    characterId: 'ministro',
    memoryFlagAdded: 'min_first_met',
    choices: [
      {
        id: 'char_min_001_a',
        textKey: 'event.char_min_001.choice_a',
        effects: { deficitDelta: -5, popularityDelta: -3, marketConfidenceDelta: 8 },
      },
      {
        id: 'char_min_001_b',
        textKey: 'event.char_min_001.choice_b',
        effects: { popularityDelta: 2, marketConfidenceDelta: -3 },
      },
      {
        id: 'char_min_001_c',
        textKey: 'event.char_min_001.choice_c',
        effects: { deficitDelta: -2, marketConfidenceDelta: 3 },
      },
      {
        id: 'char_min_001_d',
        textKey: 'event.char_min_001.choice_d',
        effects: { deficitDelta: -3, popularityDelta: 1, marketConfidenceDelta: 5 },
      },
    ],
  },
  {
    id: 'char_min_002',
    category: 'economic',
    titleKey: 'event.char_min_002.title',
    bodyKey: 'event.char_min_002.body',
    weight: 5,
    minTurn: 9,
    maxTurn: 20,
    characterId: 'ministro',
    requiredFlags: ['min_first_met'],
    memoryFlagAdded: 'min_plan_discussed',
    choices: [
      {
        id: 'char_min_002_a',
        textKey: 'event.char_min_002.choice_a',
        effects: { deficitDelta: -8, inflationDelta: -3, popularityDelta: -5, marketConfidenceDelta: 10 },
      },
      {
        id: 'char_min_002_b',
        textKey: 'event.char_min_002.choice_b',
        effects: { popularityDelta: 5, deficitDelta: 3, marketConfidenceDelta: -5 },
      },
      {
        id: 'char_min_002_c',
        textKey: 'event.char_min_002.choice_c',
        effects: { deficitDelta: -4, inflationDelta: -1, popularityDelta: -2, marketConfidenceDelta: 5 },
      },
      {
        id: 'char_min_002_d',
        textKey: 'event.char_min_002.choice_d',
        effects: { popularityDelta: 3, deficitDelta: 1, stabilityDelta: 2, marketConfidenceDelta: 2 },
      },
    ],
  },
  {
    id: 'char_min_003',
    category: 'political',
    titleKey: 'event.char_min_003.title',
    bodyKey: 'event.char_min_003.body',
    weight: 4,
    minTurn: 20,
    characterId: 'ministro',
    requiredFlags: ['min_plan_discussed'],
    choices: [
      {
        id: 'char_min_003_a',
        textKey: 'event.char_min_003.choice_a',
        effects: { deficitDelta: -10, inflationDelta: -5, popularityDelta: -8, marketConfidenceDelta: 15 },
      },
      {
        id: 'char_min_003_b',
        textKey: 'event.char_min_003.choice_b',
        effects: { popularityDelta: 3, stabilityDelta: -5, marketConfidenceDelta: -10 },
      },
      {
        id: 'char_min_003_c',
        textKey: 'event.char_min_003.choice_c',
        effects: { popularityDelta: -5, stabilityDelta: 5, marketConfidenceDelta: 5 },
      },
      {
        id: 'char_min_003_d',
        textKey: 'event.char_min_003.choice_d',
        effects: { deficitDelta: -5, inflationDelta: -3, popularityDelta: -4, marketConfidenceDelta: 8 },
      },
    ],
  },

  // ─── Sindicalista (Hugo Morales) ────────────────────────────────────────
  {
    id: 'char_sind_001',
    category: 'social',
    titleKey: 'event.char_sind_001.title',
    bodyKey: 'event.char_sind_001.body',
    weight: 6,
    minTurn: 3,
    maxTurn: 9,
    characterId: 'sindicalista',
    memoryFlagAdded: 'sind_first_met',
    choices: [
      {
        id: 'char_sind_001_a',
        textKey: 'event.char_sind_001.choice_a',
        effects: { popularityDelta: 8, stabilityDelta: 7 },
      },
      {
        id: 'char_sind_001_b',
        textKey: 'event.char_sind_001.choice_b',
        effects: { popularityDelta: -2, stabilityDelta: -2 },
      },
      {
        id: 'char_sind_001_c',
        textKey: 'event.char_sind_001.choice_c',
        effects: { popularityDelta: 4, stabilityDelta: 3, deficitDelta: 2 },
      },
      {
        id: 'char_sind_001_d',
        textKey: 'event.char_sind_001.choice_d',
        effects: { popularityDelta: 3, stabilityDelta: 4, deficitDelta: 1 },
      },
    ],
  },
  {
    id: 'char_sind_002',
    category: 'social',
    titleKey: 'event.char_sind_002.title',
    bodyKey: 'event.char_sind_002.body',
    weight: 5,
    minTurn: 10,
    maxTurn: 22,
    characterId: 'sindicalista',
    requiredFlags: ['sind_first_met'],
    memoryFlagAdded: 'sind_confronted',
    choices: [
      {
        id: 'char_sind_002_a',
        textKey: 'event.char_sind_002.choice_a',
        effects: { popularityDelta: 5, stabilityDelta: 11 },
      },
      {
        id: 'char_sind_002_b',
        textKey: 'event.char_sind_002.choice_b',
        effects: { popularityDelta: -5, stabilityDelta: -8, mediaCredibilityDelta: 5 },
      },
      {
        id: 'char_sind_002_c',
        textKey: 'event.char_sind_002.choice_c',
        effects: { popularityDelta: 2, stabilityDelta: 5, deficitDelta: 3 },
      },
      {
        id: 'char_sind_002_d',
        textKey: 'event.char_sind_002.choice_d',
        effects: { popularityDelta: -1, stabilityDelta: 3, mediaCredibilityDelta: 3 },
      },
    ],
  },
  {
    id: 'char_sind_003',
    category: 'political',
    titleKey: 'event.char_sind_003.title',
    bodyKey: 'event.char_sind_003.body',
    weight: 4,
    minTurn: 22,
    characterId: 'sindicalista',
    requiredFlags: ['sind_confronted'],
    choices: [
      {
        id: 'char_sind_003_a',
        textKey: 'event.char_sind_003.choice_a',
        effects: { popularityDelta: 10, stabilityDelta: 16 },
      },
      {
        id: 'char_sind_003_b',
        textKey: 'event.char_sind_003.choice_b',
        effects: { popularityDelta: 8, stabilityDelta: -5, mediaCredibilityDelta: 10 },
      },
      {
        id: 'char_sind_003_c',
        textKey: 'event.char_sind_003.choice_c',
        effects: { popularityDelta: 6, stabilityDelta: 10, deficitDelta: 4 },
      },
      {
        id: 'char_sind_003_d',
        textKey: 'event.char_sind_003.choice_d',
        effects: { popularityDelta: 2, stabilityDelta: 5, marketConfidenceDelta: 8, deficitDelta: -3 },
      },
    ],
  },

  // ─── Periodista (Valentina Cruz) ────────────────────────────────────────
  {
    id: 'char_per_001',
    category: 'political',
    titleKey: 'event.char_per_001.title',
    bodyKey: 'event.char_per_001.body',
    weight: 6,
    minTurn: 4,
    maxTurn: 10,
    characterId: 'periodista',
    memoryFlagAdded: 'per_first_met',
    choices: [
      {
        id: 'char_per_001_a',
        textKey: 'event.char_per_001.choice_a',
        effects: { popularityDelta: 5, mediaCredibilityDelta: 8 },
      },
      {
        id: 'char_per_001_b',
        textKey: 'event.char_per_001.choice_b',
        effects: { mediaCredibilityDelta: -5, popularityDelta: -2 },
      },
      {
        id: 'char_per_001_c',
        textKey: 'event.char_per_001.choice_c',
        effects: { popularityDelta: 2, mediaCredibilityDelta: 3 },
      },
      {
        id: 'char_per_001_d',
        textKey: 'event.char_per_001.choice_d',
        effects: { popularityDelta: 1, mediaCredibilityDelta: 4 },
      },
    ],
  },
  {
    id: 'char_per_002',
    category: 'political',
    titleKey: 'event.char_per_002.title',
    bodyKey: 'event.char_per_002.body',
    weight: 5,
    minTurn: 11,
    maxTurn: 25,
    characterId: 'periodista',
    requiredFlags: ['per_first_met'],
    memoryFlagAdded: 'per_investigated',
    choices: [
      {
        id: 'char_per_002_a',
        textKey: 'event.char_per_002.choice_a',
        effects: { mediaCredibilityDelta: 5, popularityDelta: 3 },
      },
      {
        id: 'char_per_002_b',
        textKey: 'event.char_per_002.choice_b',
        effects: { mediaCredibilityDelta: -8, popularityDelta: -3 },
      },
      {
        id: 'char_per_002_c',
        textKey: 'event.char_per_002.choice_c',
        effects: { mediaCredibilityDelta: -2, popularityDelta: 1 },
      },
      {
        id: 'char_per_002_d',
        textKey: 'event.char_per_002.choice_d',
        effects: { mediaCredibilityDelta: 2, popularityDelta: 2 },
      },
    ],
  },
  {
    id: 'char_per_003',
    category: 'political',
    titleKey: 'event.char_per_003.title',
    bodyKey: 'event.char_per_003.body',
    weight: 4,
    minTurn: 25,
    characterId: 'periodista',
    requiredFlags: ['per_investigated'],
    choices: [
      {
        id: 'char_per_003_a',
        textKey: 'event.char_per_003.choice_a',
        effects: { mediaCredibilityDelta: 12, popularityDelta: 5 },
      },
      {
        id: 'char_per_003_b',
        textKey: 'event.char_per_003.choice_b',
        effects: { popularityDelta: -5, mediaCredibilityDelta: -10 },
      },
      {
        id: 'char_per_003_c',
        textKey: 'event.char_per_003.choice_c',
        effects: { mediaCredibilityDelta: 5, popularityDelta: 2 },
      },
      {
        id: 'char_per_003_d',
        textKey: 'event.char_per_003.choice_d',
        effects: { mediaCredibilityDelta: 6, popularityDelta: 3, deficitDelta: 2 },
      },
    ],
  },

  // ─── Embajador (James Whitmore) ─────────────────────────────────────────
  {
    id: 'char_emb_001',
    category: 'international',
    titleKey: 'event.char_emb_001.title',
    bodyKey: 'event.char_emb_001.body',
    weight: 5,
    minTurn: 5,
    maxTurn: 12,
    characterId: 'embajador',
    memoryFlagAdded: 'emb_first_met',
    choices: [
      {
        id: 'char_emb_001_a',
        textKey: 'event.char_emb_001.choice_a',
        effects: { marketConfidenceDelta: 5, foreignReservesDelta: 5 },
      },
      {
        id: 'char_emb_001_b',
        textKey: 'event.char_emb_001.choice_b',
        effects: { popularityDelta: 3, marketConfidenceDelta: -3 },
      },
      {
        id: 'char_emb_001_c',
        textKey: 'event.char_emb_001.choice_c',
        effects: { marketConfidenceDelta: 3, foreignReservesDelta: 2 },
      },
      {
        id: 'char_emb_001_d',
        textKey: 'event.char_emb_001.choice_d',
        effects: { marketConfidenceDelta: 4, foreignReservesDelta: 3, popularityDelta: 2 },
      },
    ],
  },
  {
    id: 'char_emb_002',
    category: 'international',
    titleKey: 'event.char_emb_002.title',
    bodyKey: 'event.char_emb_002.body',
    weight: 5,
    minTurn: 13,
    maxTurn: 28,
    characterId: 'embajador',
    requiredFlags: ['emb_first_met'],
    memoryFlagAdded: 'emb_negotiated',
    choices: [
      {
        id: 'char_emb_002_a',
        textKey: 'event.char_emb_002.choice_a',
        effects: { foreignReservesDelta: 10, marketConfidenceDelta: 8, deficitDelta: -5 },
      },
      {
        id: 'char_emb_002_b',
        textKey: 'event.char_emb_002.choice_b',
        effects: { popularityDelta: 5, marketConfidenceDelta: -5 },
      },
      {
        id: 'char_emb_002_c',
        textKey: 'event.char_emb_002.choice_c',
        effects: { foreignReservesDelta: 5, marketConfidenceDelta: 4, deficitDelta: -2 },
      },
      {
        id: 'char_emb_002_d',
        textKey: 'event.char_emb_002.choice_d',
        effects: { foreignReservesDelta: 7, marketConfidenceDelta: 6, popularityDelta: 3 },
      },
    ],
  },
  {
    id: 'char_emb_003',
    category: 'international',
    titleKey: 'event.char_emb_003.title',
    bodyKey: 'event.char_emb_003.body',
    weight: 4,
    minTurn: 28,
    characterId: 'embajador',
    requiredFlags: ['emb_negotiated'],
    choices: [
      {
        id: 'char_emb_003_a',
        textKey: 'event.char_emb_003.choice_a',
        effects: { foreignReservesDelta: 15, marketConfidenceDelta: 12, deficitDelta: -8 },
      },
      {
        id: 'char_emb_003_b',
        textKey: 'event.char_emb_003.choice_b',
        effects: { popularityDelta: 8, foreignReservesDelta: -5, marketConfidenceDelta: -8 },
      },
      {
        id: 'char_emb_003_c',
        textKey: 'event.char_emb_003.choice_c',
        effects: { foreignReservesDelta: 10, marketConfidenceDelta: 8, deficitDelta: -5, popularityDelta: 2 },
      },
      {
        id: 'char_emb_003_d',
        textKey: 'event.char_emb_003.choice_d',
        effects: { foreignReservesDelta: 8, marketConfidenceDelta: 5, popularityDelta: 5 },
      },
    ],
  },

  // ─── Gobernadora (Laura Peñaloza) ───────────────────────────────────────
  {
    id: 'char_gob_001',
    category: 'political',
    titleKey: 'event.char_gob_001.title',
    bodyKey: 'event.char_gob_001.body',
    weight: 5,
    minTurn: 6,
    maxTurn: 14,
    characterId: 'gobernadora',
    memoryFlagAdded: 'gob_first_met',
    choices: [
      {
        id: 'char_gob_001_a',
        textKey: 'event.char_gob_001.choice_a',
        effects: { popularityDelta: 8, stabilityDelta: 4, governmentSeatsDelta: 5 },
      },
      {
        id: 'char_gob_001_b',
        textKey: 'event.char_gob_001.choice_b',
        effects: { popularityDelta: -3, stabilityDelta: -5 },
      },
      {
        id: 'char_gob_001_c',
        textKey: 'event.char_gob_001.choice_c',
        effects: { popularityDelta: 5, stabilityDelta: 2, governmentSeatsDelta: 3, deficitDelta: 2 },
      },
      {
        id: 'char_gob_001_d',
        textKey: 'event.char_gob_001.choice_d',
        effects: { popularityDelta: 4, stabilityDelta: 3, governmentSeatsDelta: 4 },
      },
    ],
  },
  {
    id: 'char_gob_002',
    category: 'political',
    titleKey: 'event.char_gob_002.title',
    bodyKey: 'event.char_gob_002.body',
    weight: 4,
    minTurn: 15,
    maxTurn: 30,
    characterId: 'gobernadora',
    requiredFlags: ['gob_first_met'],
    memoryFlagAdded: 'gob_confronted',
    choices: [
      {
        id: 'char_gob_002_a',
        textKey: 'event.char_gob_002.choice_a',
        effects: { popularityDelta: 5, stabilityDelta: 3, governmentSeatsDelta: 8 },
      },
      {
        id: 'char_gob_002_b',
        textKey: 'event.char_gob_002.choice_b',
        effects: { popularityDelta: 3, stabilityDelta: -8, governmentSeatsDelta: -10 },
      },
      {
        id: 'char_gob_002_c',
        textKey: 'event.char_gob_002.choice_c',
        effects: { popularityDelta: 4, stabilityDelta: 2, governmentSeatsDelta: 5, deficitDelta: 3 },
      },
      {
        id: 'char_gob_002_d',
        textKey: 'event.char_gob_002.choice_d',
        effects: { popularityDelta: 3, stabilityDelta: 4, governmentSeatsDelta: 4 },
      },
    ],
  },
  {
    id: 'char_gob_003',
    category: 'political',
    titleKey: 'event.char_gob_003.title',
    bodyKey: 'event.char_gob_003.body',
    weight: 3,
    minTurn: 30,
    characterId: 'gobernadora',
    requiredFlags: ['gob_confronted'],
    choices: [
      {
        id: 'char_gob_003_a',
        textKey: 'event.char_gob_003.choice_a',
        effects: { popularityDelta: 5, stabilityDelta: 4, governmentSeatsDelta: 15 },
      },
      {
        id: 'char_gob_003_b',
        textKey: 'event.char_gob_003.choice_b',
        effects: { popularityDelta: -2, stabilityDelta: -5, governmentSeatsDelta: -5 },
      },
      {
        id: 'char_gob_003_c',
        textKey: 'event.char_gob_003.choice_c',
        effects: { popularityDelta: 4, stabilityDelta: 3, governmentSeatsDelta: 10 },
      },
      {
        id: 'char_gob_003_d',
        textKey: 'event.char_gob_003.choice_d',
        effects: { popularityDelta: 3, stabilityDelta: 2, governmentSeatsDelta: 12, deficitDelta: 1 },
      },
    ],
  },
];
