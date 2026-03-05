import type { EventCard } from '../types.js';

export const ECONOMIC_CARDS: EventCard[] = [
  {
    id: 'eco_001',
    category: 'economic',
    titleKey: 'event.eco_001.title',
    bodyKey: 'event.eco_001.body',
    weight: 10,
    choices: [
      {
        id: 'eco_001_a',
        textKey: 'event.eco_001.choice_a',
        effects: { inflationDelta: -5, deficitDelta: 6, marketConfidenceDelta: 3 },
      },
      {
        id: 'eco_001_b',
        textKey: 'event.eco_001.choice_b',
        effects: { inflationDelta: 4, deficitDelta: -4, popularityDelta: -5 },
      },
      {
        id: 'eco_001_c',
        textKey: 'event.eco_001.choice_c',
        effects: { inflationDelta: 2, deficitDelta: 2, marketConfidenceDelta: -5 },
      },
    ],
  },
  {
    id: 'eco_002',
    category: 'economic',
    titleKey: 'event.eco_002.title',
    bodyKey: 'event.eco_002.body',
    weight: 9,
    choices: [
      {
        id: 'eco_002_a',
        textKey: 'event.eco_002.choice_a',
        effects: { marketConfidenceDelta: 15, popularityDelta: 5, deficitDelta: -3 },
      },
      {
        id: 'eco_002_b',
        textKey: 'event.eco_002.choice_b',
        effects: { marketConfidenceDelta: -10, popularityDelta: 10, deficitDelta: 5 },
      },
    ],
  },
  {
    id: 'eco_003',
    category: 'economic',
    titleKey: 'event.eco_003.title',
    bodyKey: 'event.eco_003.body',
    weight: 8,
    minTurn: 4,
    choices: [
      {
        id: 'eco_003_a',
        textKey: 'event.eco_003.choice_a',
        effects: { inflationDelta: -8, popularityDelta: -8, marketConfidenceDelta: 12 },
      },
      {
        id: 'eco_003_b',
        textKey: 'event.eco_003.choice_b',
        effects: { inflationDelta: 5, popularityDelta: 8, deficitDelta: 6 },
      },
    ],
  },
  {
    id: 'eco_004',
    category: 'economic',
    titleKey: 'event.eco_004.title',
    bodyKey: 'event.eco_004.body',
    weight: 7,
    minTurn: 6,
    choices: [
      {
        id: 'eco_004_a',
        textKey: 'event.eco_004.choice_a',
        effects: { deficitDelta: -12, popularityDelta: -10, stabilityDelta: -5 },
      },
      {
        id: 'eco_004_b',
        textKey: 'event.eco_004.choice_b',
        effects: { deficitDelta: 8, popularityDelta: 6, stabilityDelta: 3 },
      },
    ],
  },
  {
    id: 'eco_005',
    category: 'economic',
    titleKey: 'event.eco_005.title',
    bodyKey: 'event.eco_005.body',
    weight: 10,
    choices: [
      {
        id: 'eco_005_a',
        textKey: 'event.eco_005.choice_a',
        effects: { currencyStrengthDelta: 10, inflationDelta: -4, marketConfidenceDelta: 8 },
      },
      {
        id: 'eco_005_b',
        textKey: 'event.eco_005.choice_b',
        effects: { currencyStrengthDelta: -8, inflationDelta: 6, popularityDelta: 5 },
      },
    ],
  },
  {
    id: 'eco_006',
    category: 'economic',
    titleKey: 'event.eco_006.title',
    bodyKey: 'event.eco_006.body',
    weight: 9,
    minTurn: 3,
    choices: [
      {
        id: 'eco_006_a',
        textKey: 'event.eco_006.choice_a',
        effects: { foreignReservesDelta: 10, deficitDelta: 5, inflationDelta: -2 },
      },
      {
        id: 'eco_006_b',
        textKey: 'event.eco_006.choice_b',
        effects: { foreignReservesDelta: -5, popularityDelta: 8, stabilityDelta: 4 },
      },
    ],
  },
  {
    id: 'eco_007',
    category: 'economic',
    titleKey: 'event.eco_007.title',
    bodyKey: 'event.eco_007.body',
    weight: 8,
    choices: [
      {
        id: 'eco_007_a',
        textKey: 'event.eco_007.choice_a',
        effects: { gdpGrowthDelta: 1.5, marketConfidenceDelta: 10, deficitDelta: 4 },
      },
      {
        id: 'eco_007_b',
        textKey: 'event.eco_007.choice_b',
        effects: { gdpGrowthDelta: -0.5, deficitDelta: -6, popularityDelta: -4 },
      },
    ],
  },
  {
    id: 'eco_008',
    category: 'economic',
    titleKey: 'event.eco_008.title',
    bodyKey: 'event.eco_008.body',
    weight: 9,
    minTurn: 8,
    choices: [
      {
        id: 'eco_008_a',
        textKey: 'event.eco_008.choice_a',
        effects: { marketConfidenceDelta: 20, deficitDelta: 10, inflationDelta: 3 },
        requiresVote: true,
        voteChance: 0.5,
      },
      {
        id: 'eco_008_b',
        textKey: 'event.eco_008.choice_b',
        effects: { popularityDelta: 8, deficitDelta: -5, marketConfidenceDelta: -8 },
      },
    ],
  },
  {
    id: 'eco_009',
    category: 'economic',
    titleKey: 'event.eco_009.title',
    bodyKey: 'event.eco_009.body',
    weight: 7,
    minTurn: 10,
    choices: [
      {
        id: 'eco_009_a',
        textKey: 'event.eco_009.choice_a',
        effects: { inflationDelta: -10, popularityDelta: -12, marketConfidenceDelta: 15 },
      },
      {
        id: 'eco_009_b',
        textKey: 'event.eco_009.choice_b',
        effects: { inflationDelta: 8, popularityDelta: 5, deficitDelta: 5 },
      },
    ],
  },
  {
    id: 'eco_010',
    category: 'economic',
    titleKey: 'event.eco_010.title',
    bodyKey: 'event.eco_010.body',
    weight: 8,
    choices: [
      {
        id: 'eco_010_a',
        textKey: 'event.eco_010.choice_a',
        effects: { deficitDelta: -8, stabilityDelta: -6, popularityDelta: -5 },
      },
      {
        id: 'eco_010_b',
        textKey: 'event.eco_010.choice_b',
        effects: { deficitDelta: 6, popularityDelta: 10, stabilityDelta: 5 },
      },
    ],
  },
  {
    id: 'eco_011',
    category: 'economic',
    titleKey: 'event.eco_011.title',
    bodyKey: 'event.eco_011.body',
    weight: 9,
    choices: [
      {
        id: 'eco_011_a',
        textKey: 'event.eco_011.choice_a',
        effects: { currencyStrengthDelta: -15, inflationDelta: 8, foreignReservesDelta: 10 },
      },
      {
        id: 'eco_011_b',
        textKey: 'event.eco_011.choice_b',
        effects: { currencyStrengthDelta: 8, foreignReservesDelta: -8, popularityDelta: -5 },
      },
    ],
  },
  {
    id: 'eco_012',
    category: 'economic',
    titleKey: 'event.eco_012.title',
    bodyKey: 'event.eco_012.body',
    weight: 7,
    minTurn: 12,
    choices: [
      {
        id: 'eco_012_a',
        textKey: 'event.eco_012.choice_a',
        effects: { gdpGrowthDelta: 2, deficitDelta: 8, popularityDelta: 10 },
      },
      {
        id: 'eco_012_b',
        textKey: 'event.eco_012.choice_b',
        effects: { gdpGrowthDelta: -1, deficitDelta: -10, marketConfidenceDelta: 12 },
      },
    ],
  },
  {
    id: 'eco_013',
    category: 'economic',
    titleKey: 'event.eco_013.title',
    bodyKey: 'event.eco_013.body',
    weight: 8,
    choices: [
      {
        id: 'eco_013_a',
        textKey: 'event.eco_013.choice_a',
        effects: { marketConfidenceDelta: -20, inflationDelta: 5, popularityDelta: -8 },
      },
      {
        id: 'eco_013_b',
        textKey: 'event.eco_013.choice_b',
        effects: { deficitDelta: 10, popularityDelta: 8, stabilityDelta: 3 },
      },
    ],
  },
  {
    id: 'eco_014',
    category: 'economic',
    titleKey: 'event.eco_014.title',
    bodyKey: 'event.eco_014.body',
    weight: 9,
    minTurn: 5,
    choices: [
      {
        id: 'eco_014_a',
        textKey: 'event.eco_014.choice_a',
        effects: { popularityDelta: 12, deficitDelta: 8, inflationDelta: 3 },
      },
      {
        id: 'eco_014_b',
        textKey: 'event.eco_014.choice_b',
        effects: { popularityDelta: -6, deficitDelta: -6, marketConfidenceDelta: 10 },
      },
    ],
  },
  {
    id: 'eco_015',
    category: 'economic',
    titleKey: 'event.eco_015.title',
    bodyKey: 'event.eco_015.body',
    weight: 8,
    minTurn: 18,
    choices: [
      {
        id: 'eco_015_a',
        textKey: 'event.eco_015.choice_a',
        effects: { inflationDelta: -15, popularityDelta: -15, marketConfidenceDelta: 20 },
      },
      {
        id: 'eco_015_b',
        textKey: 'event.eco_015.choice_b',
        effects: { inflationDelta: 8, popularityDelta: 8, deficitDelta: 10 },
      },
    ],
  },
];
