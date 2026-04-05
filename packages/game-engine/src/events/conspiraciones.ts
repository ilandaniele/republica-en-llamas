import type { EventCard } from '../types.js';

/**
 * Conspiraciones & Operetas — eventos basados en la política argentina reciente:
 * CFK, $LIBRA, Adorni, Kicillof, ANDIS, AMIA, entre otros.
 */
export const CONSPIRACION_CARDS: EventCard[] = [
  {
    id: 'con_001',
    category: 'political',
    titleKey: 'event.con_001.title',
    bodyKey: 'event.con_001.body',
    weight: 8,
    minTurn: 1,
    choices: [
      {
        id: 'con_001_a',
        textKey: 'event.con_001.choice_a',
        effects: { popularityDelta: -3, mediaCredibilityDelta: -5, stabilityDelta: -2 },
      },
      {
        id: 'con_001_b',
        textKey: 'event.con_001.choice_b',
        effects: { popularityDelta: 2, mediaCredibilityDelta: 5, stabilityDelta: -4 },
      },
      {
        id: 'con_001_c',
        textKey: 'event.con_001.choice_c',
        effects: { popularityDelta: -5, mediaCredibilityDelta: 10, stabilityDelta: 2 },
      },
    ],
  },
  {
    id: 'con_002',
    category: 'political',
    titleKey: 'event.con_002.title',
    bodyKey: 'event.con_002.body',
    weight: 7,
    minTurn: 2,
    choices: [
      {
        id: 'con_002_a',
        textKey: 'event.con_002.choice_a',
        effects: { popularityDelta: 3, mediaCredibilityDelta: -8, stabilityDelta: -3 },
      },
      {
        id: 'con_002_b',
        textKey: 'event.con_002.choice_b',
        effects: { popularityDelta: -4, mediaCredibilityDelta: 6, stabilityDelta: 3 },
      },
    ],
  },
  {
    id: 'con_003',
    category: 'political',
    titleKey: 'event.con_003.title',
    bodyKey: 'event.con_003.body',
    weight: 7,
    minTurn: 3,
    minDifficulty: 'normal',
    choices: [
      {
        id: 'con_003_a',
        textKey: 'event.con_003.choice_a',
        effects: { popularityDelta: -8, stabilityDelta: -10, governmentSeatsDelta: -5 },
      },
      {
        id: 'con_003_b',
        textKey: 'event.con_003.choice_b',
        effects: { popularityDelta: 5, mediaCredibilityDelta: -10, stabilityDelta: -5 },
      },
      {
        id: 'con_003_c',
        textKey: 'event.con_003.choice_c',
        effects: { popularityDelta: -3, mediaCredibilityDelta: 4, stabilityDelta: -3 },
      },
    ],
  },
  {
    id: 'con_004',
    category: 'political',
    titleKey: 'event.con_004.title',
    bodyKey: 'event.con_004.body',
    weight: 7,
    minTurn: 4,
    choices: [
      {
        id: 'con_004_a',
        textKey: 'event.con_004.choice_a',
        effects: { popularityDelta: -5, governmentSeatsDelta: -10, stabilityDelta: -5 },
      },
      {
        id: 'con_004_b',
        textKey: 'event.con_004.choice_b',
        effects: { popularityDelta: 2, deficitDelta: 4, stabilityDelta: 2 },
      },
      {
        id: 'con_004_c',
        textKey: 'event.con_004.choice_c',
        effects: { popularityDelta: -2, mediaCredibilityDelta: 5, stabilityDelta: 0 },
      },
    ],
  },
  {
    id: 'con_005',
    category: 'political',
    titleKey: 'event.con_005.title',
    bodyKey: 'event.con_005.body',
    weight: 8,
    minTurn: 1,
    choices: [
      {
        id: 'con_005_a',
        textKey: 'event.con_005.choice_a',
        effects: { popularityDelta: -3, marketConfidenceDelta: -5, currencyStrengthDelta: -3 },
      },
      {
        id: 'con_005_b',
        textKey: 'event.con_005.choice_b',
        effects: { popularityDelta: 2, mediaCredibilityDelta: -5, marketConfidenceDelta: -3 },
      },
      {
        id: 'con_005_c',
        textKey: 'event.con_005.choice_c',
        effects: { popularityDelta: -4, mediaCredibilityDelta: 8, marketConfidenceDelta: 2 },
      },
    ],
  },
  {
    id: 'con_006',
    category: 'economic',
    titleKey: 'event.con_006.title',
    bodyKey: 'event.con_006.body',
    weight: 9,
    minTurn: 3,
    choices: [
      {
        id: 'con_006_a',
        textKey: 'event.con_006.choice_a',
        effects: { popularityDelta: -10, marketConfidenceDelta: -15, mediaCredibilityDelta: -8 },
      },
      {
        id: 'con_006_b',
        textKey: 'event.con_006.choice_b',
        effects: { popularityDelta: -5, marketConfidenceDelta: -8, mediaCredibilityDelta: 5 },
      },
      {
        id: 'con_006_c',
        textKey: 'event.con_006.choice_c',
        effects: { popularityDelta: 8, marketConfidenceDelta: 5, mediaCredibilityDelta: -12 },
      },
    ],
  },
  {
    id: 'con_007',
    category: 'political',
    titleKey: 'event.con_007.title',
    bodyKey: 'event.con_007.body',
    weight: 8,
    minTurn: 2,
    choices: [
      {
        id: 'con_007_a',
        textKey: 'event.con_007.choice_a',
        effects: { popularityDelta: -6, mediaCredibilityDelta: -8, stabilityDelta: -2 },
      },
      {
        id: 'con_007_b',
        textKey: 'event.con_007.choice_b',
        effects: { popularityDelta: -2, mediaCredibilityDelta: 4, stabilityDelta: 0 },
      },
      {
        id: 'con_007_c',
        textKey: 'event.con_007.choice_c',
        effects: { popularityDelta: 3, mediaCredibilityDelta: -10, stabilityDelta: -5 },
      },
    ],
  },
  {
    id: 'con_008',
    category: 'political',
    titleKey: 'event.con_008.title',
    bodyKey: 'event.con_008.body',
    weight: 8,
    minTurn: 3,
    choices: [
      {
        id: 'con_008_a',
        textKey: 'event.con_008.choice_a',
        effects: { popularityDelta: -4, deficitDelta: -3, stabilityDelta: -5 },
      },
      {
        id: 'con_008_b',
        textKey: 'event.con_008.choice_b',
        effects: { popularityDelta: -2, deficitDelta: 5, stabilityDelta: 3 },
      },
      {
        id: 'con_008_c',
        textKey: 'event.con_008.choice_c',
        effects: { popularityDelta: 5, mediaCredibilityDelta: -5, stabilityDelta: -4, governmentSeatsDelta: -8 },
      },
    ],
  },
  {
    id: 'con_009',
    category: 'political',
    titleKey: 'event.con_009.title',
    bodyKey: 'event.con_009.body',
    weight: 7,
    minTurn: 2,
    choices: [
      {
        id: 'con_009_a',
        textKey: 'event.con_009.choice_a',
        effects: { popularityDelta: -7, mediaCredibilityDelta: -6, stabilityDelta: -3 },
      },
      {
        id: 'con_009_b',
        textKey: 'event.con_009.choice_b',
        effects: { popularityDelta: -3, mediaCredibilityDelta: 5, stabilityDelta: 0 },
      },
    ],
  },
  {
    id: 'con_010',
    category: 'social',
    titleKey: 'event.con_010.title',
    bodyKey: 'event.con_010.body',
    weight: 8,
    minTurn: 4,
    choices: [
      {
        id: 'con_010_a',
        textKey: 'event.con_010.choice_a',
        effects: { popularityDelta: -8, mediaCredibilityDelta: -10, stabilityDelta: -5 },
      },
      {
        id: 'con_010_b',
        textKey: 'event.con_010.choice_b',
        effects: { popularityDelta: -3, mediaCredibilityDelta: 6, stabilityDelta: -2 },
      },
      {
        id: 'con_010_c',
        textKey: 'event.con_010.choice_c',
        effects: { popularityDelta: 4, mediaCredibilityDelta: -8, stabilityDelta: -6 },
      },
    ],
  },
  {
    id: 'con_011',
    category: 'international',
    titleKey: 'event.con_011.title',
    bodyKey: 'event.con_011.body',
    weight: 6,
    minTurn: 2,
    choices: [
      {
        id: 'con_011_a',
        textKey: 'event.con_011.choice_a',
        effects: { popularityDelta: 5, mediaCredibilityDelta: 3, stabilityDelta: 2 },
      },
      {
        id: 'con_011_b',
        textKey: 'event.con_011.choice_b',
        effects: { popularityDelta: -4, marketConfidenceDelta: 5, stabilityDelta: -2 },
      },
      {
        id: 'con_011_c',
        textKey: 'event.con_011.choice_c',
        effects: { popularityDelta: -2, mediaCredibilityDelta: -5, marketConfidenceDelta: 3 },
      },
    ],
  },
  {
    id: 'con_012',
    category: 'social',
    titleKey: 'event.con_012.title',
    bodyKey: 'event.con_012.body',
    weight: 8,
    minTurn: 2,
    choices: [
      {
        id: 'con_012_a',
        textKey: 'event.con_012.choice_a',
        effects: { popularityDelta: 5, stabilityDelta: -8, mediaCredibilityDelta: -5 },
      },
      {
        id: 'con_012_b',
        textKey: 'event.con_012.choice_b',
        effects: { popularityDelta: -3, stabilityDelta: 5, mediaCredibilityDelta: 3 },
      },
      {
        id: 'con_012_c',
        textKey: 'event.con_012.choice_c',
        effects: { popularityDelta: -2, stabilityDelta: -3, marketConfidenceDelta: 3 },
      },
    ],
  },
  {
    id: 'con_013',
    category: 'international',
    titleKey: 'event.con_013.title',
    bodyKey: 'event.con_013.body',
    weight: 5,
    minTurn: 5,
    isLifeline: true,
    lifelineFor: ['marketConfidence', 'mediaCredibility'],
    choices: [
      {
        id: 'con_013_a',
        textKey: 'event.con_013.choice_a',
        effects: { popularityDelta: 8, marketConfidenceDelta: 10, mediaCredibilityDelta: 8 },
      },
      {
        id: 'con_013_b',
        textKey: 'event.con_013.choice_b',
        effects: { popularityDelta: 4, marketConfidenceDelta: 5, mediaCredibilityDelta: 4 },
      },
    ],
  },
  {
    id: 'con_014',
    category: 'political',
    titleKey: 'event.con_014.title',
    bodyKey: 'event.con_014.body',
    weight: 9,
    minTurn: 5,
    minDifficulty: 'normal',
    choices: [
      {
        id: 'con_014_a',
        textKey: 'event.con_014.choice_a',
        effects: { popularityDelta: -10, stabilityDelta: -12, governmentSeatsDelta: -8, mediaCredibilityDelta: -5 },
      },
      {
        id: 'con_014_b',
        textKey: 'event.con_014.choice_b',
        effects: { popularityDelta: 6, mediaCredibilityDelta: -8, stabilityDelta: -8 },
      },
      {
        id: 'con_014_c',
        textKey: 'event.con_014.choice_c',
        effects: { popularityDelta: -3, mediaCredibilityDelta: 5, stabilityDelta: -5 },
      },
    ],
  },
  {
    id: 'con_015',
    category: 'political',
    titleKey: 'event.con_015.title',
    bodyKey: 'event.con_015.body',
    weight: 7,
    minTurn: 4,
    choices: [
      {
        id: 'con_015_a',
        textKey: 'event.con_015.choice_a',
        effects: { popularityDelta: -6, governmentSeatsDelta: -12, mediaCredibilityDelta: -5 },
      },
      {
        id: 'con_015_b',
        textKey: 'event.con_015.choice_b',
        effects: { popularityDelta: -2, governmentSeatsDelta: -5, stabilityDelta: -3 },
      },
      {
        id: 'con_015_c',
        textKey: 'event.con_015.choice_c',
        effects: { popularityDelta: 3, mediaCredibilityDelta: -6, stabilityDelta: -8, governmentSeatsDelta: -8 },
      },
    ],
  },
];
