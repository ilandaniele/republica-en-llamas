import type { EventCard } from '../types.js';

export const INTERNATIONAL_CARDS: EventCard[] = [
  {
    id: 'int_001',
    category: 'international',
    titleKey: 'event.int_001.title',
    bodyKey: 'event.int_001.body',
    weight: 10,
    choices: [
      {
        id: 'int_001_a',
        textKey: 'event.int_001.choice_a',
        effects: { marketConfidenceDelta: 15, foreignReservesDelta: 8, popularityDelta: 5 },
      },
      {
        id: 'int_001_b',
        textKey: 'event.int_001.choice_b',
        effects: { marketConfidenceDelta: -10, popularityDelta: 10, stabilityDelta: 5 },
      },
    ],
  },
  {
    id: 'int_002',
    category: 'international',
    titleKey: 'event.int_002.title',
    bodyKey: 'event.int_002.body',
    weight: 9,
    choices: [
      {
        id: 'int_002_a',
        textKey: 'event.int_002.choice_a',
        effects: { marketConfidenceDelta: 20, deficitDelta: -8, inflationDelta: -3 },
      },
      {
        id: 'int_002_b',
        textKey: 'event.int_002.choice_b',
        effects: { marketConfidenceDelta: -12, popularityDelta: 8, stabilityDelta: 5 },
      },
    ],
  },
  {
    id: 'int_003',
    category: 'international',
    titleKey: 'event.int_003.title',
    bodyKey: 'event.int_003.body',
    weight: 8,
    minTurn: 5,
    choices: [
      {
        id: 'int_003_a',
        textKey: 'event.int_003.choice_a',
        effects: { inflationDelta: 8, popularityDelta: -5, marketConfidenceDelta: -8 },
      },
      {
        id: 'int_003_b',
        textKey: 'event.int_003.choice_b',
        effects: { foreignReservesDelta: 10, deficitDelta: 5, popularityDelta: 3 },
      },
    ],
  },
  {
    id: 'int_004',
    category: 'international',
    titleKey: 'event.int_004.title',
    bodyKey: 'event.int_004.body',
    weight: 7,
    minTurn: 8,
    choices: [
      {
        id: 'int_004_a',
        textKey: 'event.int_004.choice_a',
        effects: { currencyStrengthDelta: 12, inflationDelta: -5, marketConfidenceDelta: 10 },
      },
      {
        id: 'int_004_b',
        textKey: 'event.int_004.choice_b',
        effects: { currencyStrengthDelta: -8, popularityDelta: 8, foreignReservesDelta: 5 },
      },
    ],
  },
  {
    id: 'int_005',
    category: 'international',
    titleKey: 'event.int_005.title',
    bodyKey: 'event.int_005.body',
    weight: 9,
    choices: [
      {
        id: 'int_005_a',
        textKey: 'event.int_005.choice_a',
        effects: { popularityDelta: 8, stabilityDelta: 5, mediaCredibilityDelta: 5 },
      },
      {
        id: 'int_005_b',
        textKey: 'event.int_005.choice_b',
        effects: { marketConfidenceDelta: 12, deficitDelta: -5, popularityDelta: -3 },
      },
    ],
  },
  {
    id: 'int_006',
    category: 'international',
    titleKey: 'event.int_006.title',
    bodyKey: 'event.int_006.body',
    weight: 8,
    minTurn: 4,
    choices: [
      {
        id: 'int_006_a',
        textKey: 'event.int_006.choice_a',
        effects: { inflationDelta: 10, marketConfidenceDelta: -15, popularityDelta: -5 },
      },
      {
        id: 'int_006_b',
        textKey: 'event.int_006.choice_b',
        effects: { foreignReservesDelta: 15, deficitDelta: 5, popularityDelta: 3 },
      },
    ],
  },
  {
    id: 'int_007',
    category: 'international',
    titleKey: 'event.int_007.title',
    bodyKey: 'event.int_007.body',
    weight: 7,
    minTurn: 10,
    choices: [
      {
        id: 'int_007_a',
        textKey: 'event.int_007.choice_a',
        effects: { gdpGrowthDelta: 1.5, marketConfidenceDelta: 12, deficitDelta: -4 },
      },
      {
        id: 'int_007_b',
        textKey: 'event.int_007.choice_b',
        effects: { popularityDelta: 10, stabilityDelta: 6, deficitDelta: 5 },
      },
    ],
  },
  {
    id: 'int_008',
    category: 'international',
    titleKey: 'event.int_008.title',
    bodyKey: 'event.int_008.body',
    weight: 9,
    choices: [
      {
        id: 'int_008_a',
        textKey: 'event.int_008.choice_a',
        effects: { marketConfidenceDelta: 10, inflationDelta: -3, deficitDelta: 4 },
      },
      {
        id: 'int_008_b',
        textKey: 'event.int_008.choice_b',
        effects: { marketConfidenceDelta: -8, popularityDelta: 8, stabilityDelta: 4 },
      },
    ],
  },
  {
    id: 'int_009',
    category: 'international',
    titleKey: 'event.int_009.title',
    bodyKey: 'event.int_009.body',
    weight: 8,
    minTurn: 6,
    choices: [
      {
        id: 'int_009_a',
        textKey: 'event.int_009.choice_a',
        effects: { currencyStrengthDelta: -15, inflationDelta: 10, foreignReservesDelta: -10 },
      },
      {
        id: 'int_009_b',
        textKey: 'event.int_009.choice_b',
        effects: { foreignReservesDelta: -15, currencyStrengthDelta: 10, inflationDelta: -5 },
      },
    ],
  },
  {
    id: 'int_010',
    category: 'international',
    titleKey: 'event.int_010.title',
    bodyKey: 'event.int_010.body',
    weight: 7,
    choices: [
      {
        id: 'int_010_a',
        textKey: 'event.int_010.choice_a',
        effects: { popularityDelta: 10, stabilityDelta: 5, mediaCredibilityDelta: 8 },
      },
      {
        id: 'int_010_b',
        textKey: 'event.int_010.choice_b',
        effects: { marketConfidenceDelta: 15, deficitDelta: -6, popularityDelta: -3 },
      },
    ],
  },
  {
    id: 'int_011',
    category: 'international',
    titleKey: 'event.int_011.title',
    bodyKey: 'event.int_011.body',
    weight: 8,
    minTurn: 12,
    choices: [
      {
        id: 'int_011_a',
        textKey: 'event.int_011.choice_a',
        effects: { foreignReservesDelta: 20, deficitDelta: -10, inflationDelta: -5 },
      },
      {
        id: 'int_011_b',
        textKey: 'event.int_011.choice_b',
        effects: { popularityDelta: 12, stabilityDelta: 8, deficitDelta: 5 },
      },
    ],
  },
  {
    id: 'int_012',
    category: 'international',
    titleKey: 'event.int_012.title',
    bodyKey: 'event.int_012.body',
    weight: 9,
    choices: [
      {
        id: 'int_012_a',
        textKey: 'event.int_012.choice_a',
        effects: { marketConfidenceDelta: 18, currencyStrengthDelta: 10, popularityDelta: 5 },
      },
      {
        id: 'int_012_b',
        textKey: 'event.int_012.choice_b',
        effects: { marketConfidenceDelta: -8, popularityDelta: 12, stabilityDelta: 8 },
      },
    ],
  },
  {
    id: 'int_013',
    category: 'international',
    titleKey: 'event.int_013.title',
    bodyKey: 'event.int_013.body',
    weight: 7,
    minTurn: 8,
    choices: [
      {
        id: 'int_013_a',
        textKey: 'event.int_013.choice_a',
        effects: { popularityDelta: 6, stabilityDelta: 4, mediaCredibilityDelta: 6 },
      },
      {
        id: 'int_013_b',
        textKey: 'event.int_013.choice_b',
        effects: { marketConfidenceDelta: 10, deficitDelta: -5, popularityDelta: -4 },
      },
    ],
  },
  {
    id: 'int_014',
    category: 'international',
    titleKey: 'event.int_014.title',
    bodyKey: 'event.int_014.body',
    weight: 8,
    choices: [
      {
        id: 'int_014_a',
        textKey: 'event.int_014.choice_a',
        effects: { inflationDelta: 6, marketConfidenceDelta: -10, popularityDelta: -4 },
      },
      {
        id: 'int_014_b',
        textKey: 'event.int_014.choice_b',
        effects: { deficitDelta: 6, popularityDelta: 5, stabilityDelta: 3 },
      },
    ],
  },
  {
    id: 'int_015',
    category: 'international',
    titleKey: 'event.int_015.title',
    bodyKey: 'event.int_015.body',
    weight: 9,
    minTurn: 15,
    choices: [
      {
        id: 'int_015_a',
        textKey: 'event.int_015.choice_a',
        effects: { marketConfidenceDelta: 25, foreignReservesDelta: 15, inflationDelta: -8 },
      },
      {
        id: 'int_015_b',
        textKey: 'event.int_015.choice_b',
        effects: { popularityDelta: 15, stabilityDelta: 10, deficitDelta: 8 },
      },
    ],
  },
];
