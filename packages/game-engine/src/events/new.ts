import type { EventCard } from '../types.js';

/**
 * 10 brand-new event cards — each with a unique situation not in any other deck.
 * Unique IDs: new_001 – new_010
 */
export const NEW_CARDS: EventCard[] = [
  // ─── new_001: Sequía histórica ─────────────────────────────────────────────
  {
    id: 'new_001',
    category: 'economic',
    titleKey: 'event.new_001.title',
    bodyKey: 'event.new_001.body',
    weight: 6,
    minTurn: 3,
    choices: [
      {
        id: 'new_001_a',
        textKey: 'event.new_001.choice_a',
        effects: { deficitDelta: 4, popularityDelta: 5, foreignReservesDelta: -4 },
      },
      {
        id: 'new_001_b',
        textKey: 'event.new_001.choice_b',
        effects: { foreignReservesDelta: 6, marketConfidenceDelta: 3, popularityDelta: -4 },
      },
      {
        id: 'new_001_c',
        textKey: 'event.new_001.choice_c',
        effects: { foreignReservesDelta: 8, deficitDelta: 5, marketConfidenceDelta: 5, stabilityDelta: -2 },
      },
      {
        id: 'new_001_d',
        textKey: 'event.new_001.choice_d',
        effects: { foreignReservesDelta: -12, popularityDelta: -10, stabilityDelta: -8 },
      },
    ],
  },

  // ─── new_002: Apagón nacional ──────────────────────────────────────────────
  {
    id: 'new_002',
    category: 'social',
    titleKey: 'event.new_002.title',
    bodyKey: 'event.new_002.body',
    weight: 5,
    minTurn: 4,
    choices: [
      {
        id: 'new_002_a',
        textKey: 'event.new_002.choice_a',
        effects: { popularityDelta: -5, marketConfidenceDelta: -8, stabilityDelta: -4 },
      },
      {
        id: 'new_002_b',
        textKey: 'event.new_002.choice_b',
        effects: { popularityDelta: 4, stabilityDelta: -6, mediaCredibilityDelta: 3 },
      },
      {
        id: 'new_002_c',
        textKey: 'event.new_002.choice_c',
        effects: { marketConfidenceDelta: 5, deficitDelta: 3, popularityDelta: 2 },
      },
      {
        id: 'new_002_d',
        textKey: 'event.new_002.choice_d',
        effects: { popularityDelta: -8, stabilityDelta: -10, mediaCredibilityDelta: -6 },
      },
    ],
  },

  // ─── new_003: Ciberataque al BCRA ──────────────────────────────────────────
  {
    id: 'new_003',
    category: 'economic',
    titleKey: 'event.new_003.title',
    bodyKey: 'event.new_003.body',
    weight: 4,
    minTurn: 5,
    choices: [
      {
        id: 'new_003_a',
        textKey: 'event.new_003.choice_a',
        effects: { marketConfidenceDelta: -4, currencyStrengthDelta: -3 },
      },
      {
        id: 'new_003_b',
        textKey: 'event.new_003.choice_b',
        effects: { popularityDelta: 6, marketConfidenceDelta: -8, foreignReservesDelta: -5 },
      },
      {
        id: 'new_003_c',
        textKey: 'event.new_003.choice_c',
        effects: { marketConfidenceDelta: 8, deficitDelta: 2, currencyStrengthDelta: 4 },
      },
      {
        id: 'new_003_d',
        textKey: 'event.new_003.choice_d',
        effects: { marketConfidenceDelta: 6, deficitDelta: 4, popularityDelta: 3, stabilityDelta: 2 },
      },
    ],
  },

  // ─── new_004: Escándalo de espionaje ──────────────────────────────────────
  {
    id: 'new_004',
    category: 'political',
    titleKey: 'event.new_004.title',
    bodyKey: 'event.new_004.body',
    weight: 6,
    minTurn: 6,
    choices: [
      {
        id: 'new_004_a',
        textKey: 'event.new_004.choice_a',
        effects: { popularityDelta: 5, stabilityDelta: 3, mediaCredibilityDelta: 6 },
      },
      {
        id: 'new_004_b',
        textKey: 'event.new_004.choice_b',
        effects: { popularityDelta: -12, mediaCredibilityDelta: -15, stabilityDelta: -6 },
      },
      {
        id: 'new_004_c',
        textKey: 'event.new_004.choice_c',
        effects: { popularityDelta: 8, mediaCredibilityDelta: 10, stabilityDelta: -5, governmentSeatsDelta: -5 },
      },
      {
        id: 'new_004_d',
        textKey: 'event.new_004.choice_d',
        effects: { popularityDelta: -6, mediaCredibilityDelta: -8 },
      },
    ],
  },

  // ─── new_005: Litio — el oro blanco ──────────────────────────────────────
  {
    id: 'new_005',
    category: 'international',
    titleKey: 'event.new_005.title',
    bodyKey: 'event.new_005.body',
    weight: 6,
    minTurn: 4,
    choices: [
      {
        id: 'new_005_a',
        textKey: 'event.new_005.choice_a',
        effects: { foreignReservesDelta: 12, gdpGrowthDelta: 1.5, popularityDelta: -6, stabilityDelta: -8 },
      },
      {
        id: 'new_005_b',
        textKey: 'event.new_005.choice_b',
        effects: { popularityDelta: 5, stabilityDelta: 4, foreignReservesDelta: 4 },
      },
      {
        id: 'new_005_c',
        textKey: 'event.new_005.choice_c',
        effects: { popularityDelta: 6, stabilityDelta: 2, marketConfidenceDelta: -8, deficitDelta: 5 },
      },
      {
        id: 'new_005_d',
        textKey: 'event.new_005.choice_d',
        effects: { popularityDelta: -4, marketConfidenceDelta: -6 },
      },
    ],
  },

  // ─── new_006: Cumbre del G20 ──────────────────────────────────────────────
  {
    id: 'new_006',
    category: 'international',
    titleKey: 'event.new_006.title',
    bodyKey: 'event.new_006.body',
    weight: 5,
    minTurn: 8,
    choices: [
      {
        id: 'new_006_a',
        textKey: 'event.new_006.choice_a',
        effects: { popularityDelta: 10, marketConfidenceDelta: 8, foreignReservesDelta: 5, mediaCredibilityDelta: 6 },
      },
      {
        id: 'new_006_b',
        textKey: 'event.new_006.choice_b',
        effects: { popularityDelta: -5, stabilityDelta: -6, marketConfidenceDelta: 3 },
      },
      {
        id: 'new_006_c',
        textKey: 'event.new_006.choice_c',
        effects: { popularityDelta: 6, stabilityDelta: 5, mediaCredibilityDelta: 4 },
      },
      {
        id: 'new_006_d',
        textKey: 'event.new_006.choice_d',
        effects: { foreignReservesDelta: 8, marketConfidenceDelta: 10, currencyStrengthDelta: 5, deficitDelta: -3 },
      },
    ],
  },

  // ─── new_007: Huelga de transportistas ────────────────────────────────────
  {
    id: 'new_007',
    category: 'social',
    titleKey: 'event.new_007.title',
    bodyKey: 'event.new_007.body',
    weight: 7,
    minTurn: 4,
    choices: [
      {
        id: 'new_007_a',
        textKey: 'event.new_007.choice_a',
        effects: { popularityDelta: 6, stabilityDelta: 5, deficitDelta: 4, inflationDelta: 2 },
      },
      {
        id: 'new_007_b',
        textKey: 'event.new_007.choice_b',
        effects: { popularityDelta: -10, stabilityDelta: -12, marketConfidenceDelta: -4 },
      },
      {
        id: 'new_007_c',
        textKey: 'event.new_007.choice_c',
        effects: { popularityDelta: -14, stabilityDelta: -8, mediaCredibilityDelta: -10 },
      },
      {
        id: 'new_007_d',
        textKey: 'event.new_007.choice_d',
        effects: { popularityDelta: 4, stabilityDelta: 3, deficitDelta: 2 },
      },
    ],
  },

  // ─── new_008: Crisis de vivienda ──────────────────────────────────────────
  {
    id: 'new_008',
    category: 'social',
    titleKey: 'event.new_008.title',
    bodyKey: 'event.new_008.body',
    weight: 6,
    minTurn: 5,
    choices: [
      {
        id: 'new_008_a',
        textKey: 'event.new_008.choice_a',
        effects: { popularityDelta: 8, stabilityDelta: 5, deficitDelta: 5 },
      },
      {
        id: 'new_008_b',
        textKey: 'event.new_008.choice_b',
        effects: { popularityDelta: 5, marketConfidenceDelta: -8, inflationDelta: 3 },
      },
      {
        id: 'new_008_c',
        textKey: 'event.new_008.choice_c',
        effects: { popularityDelta: 10, stabilityDelta: 6, deficitDelta: 8, inflationDelta: 2 },
      },
      {
        id: 'new_008_d',
        textKey: 'event.new_008.choice_d',
        effects: { popularityDelta: 4, marketConfidenceDelta: 3, stabilityDelta: 2 },
      },
    ],
  },

  // ─── new_009: IA y empleo ─────────────────────────────────────────────────
  {
    id: 'new_009',
    category: 'political',
    titleKey: 'event.new_009.title',
    bodyKey: 'event.new_009.body',
    weight: 5,
    minTurn: 10,
    choices: [
      {
        id: 'new_009_a',
        textKey: 'event.new_009.choice_a',
        effects: { popularityDelta: 6, stabilityDelta: 3, deficitDelta: 3, marketConfidenceDelta: 4 },
      },
      {
        id: 'new_009_b',
        textKey: 'event.new_009.choice_b',
        effects: { popularityDelta: 4, stabilityDelta: 4, marketConfidenceDelta: -6, foreignReservesDelta: -2 },
      },
      {
        id: 'new_009_c',
        textKey: 'event.new_009.choice_c',
        effects: { marketConfidenceDelta: 10, foreignReservesDelta: 8, gdpGrowthDelta: 1, popularityDelta: -4, stabilityDelta: -6 },
      },
      {
        id: 'new_009_d',
        textKey: 'event.new_009.choice_d',
        effects: { popularityDelta: 5, stabilityDelta: 5, marketConfidenceDelta: -4 },
      },
    ],
  },

  // ─── new_010: Inundaciones en el litoral ──────────────────────────────────
  {
    id: 'new_010',
    category: 'social',
    titleKey: 'event.new_010.title',
    bodyKey: 'event.new_010.body',
    weight: 7,
    minTurn: 3,
    choices: [
      {
        id: 'new_010_a',
        textKey: 'event.new_010.choice_a',
        effects: { popularityDelta: 10, stabilityDelta: 6, deficitDelta: 5, foreignReservesDelta: -3 },
      },
      {
        id: 'new_010_b',
        textKey: 'event.new_010.choice_b',
        effects: { popularityDelta: 6, stabilityDelta: 5, deficitDelta: 6 },
      },
      {
        id: 'new_010_c',
        textKey: 'event.new_010.choice_c',
        effects: { popularityDelta: 5, stabilityDelta: 4, mediaCredibilityDelta: 4 },
      },
      {
        id: 'new_010_d',
        textKey: 'event.new_010.choice_d',
        effects: { popularityDelta: -14, stabilityDelta: -12, mediaCredibilityDelta: -8 },
      },
    ],
  },
];
