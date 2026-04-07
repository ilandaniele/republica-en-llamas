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
      {
        id: 'eco_001_d',
        textKey: 'event.eco_001.choice_d',
        effects: { popularityDelta: 4, inflationDelta: -3, stabilityDelta: 4, deficitDelta: 2 },
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
      {
        id: 'eco_002_c',
        textKey: 'event.eco_002.choice_c',
        effects: { marketConfidenceDelta: 8, deficitDelta: -1, popularityDelta: 3 },
      },
      {
        id: 'eco_002_d',
        textKey: 'event.eco_002.choice_d',
        effects: { marketConfidenceDelta: 5, gdpGrowthDelta: 0.5, deficitDelta: 3 },
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
      {
        id: 'eco_003_c',
        textKey: 'event.eco_003.choice_c',
        effects: { marketConfidenceDelta: 8, deficitDelta: 2, stabilityDelta: 3 },
      },
      {
        id: 'eco_003_d',
        textKey: 'event.eco_003.choice_d',
        effects: { marketConfidenceDelta: -5, popularityDelta: 3, stabilityDelta: 2 },
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
      {
        id: 'eco_004_c',
        textKey: 'event.eco_004.choice_c',
        effects: { deficitDelta: -5, popularityDelta: 6, marketConfidenceDelta: -5 },
      },
      {
        id: 'eco_004_d',
        textKey: 'event.eco_004.choice_d',
        effects: { deficitDelta: -8, popularityDelta: -8, marketConfidenceDelta: 5 },
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
      {
        id: 'eco_005_c',
        textKey: 'event.eco_005.choice_c',
        effects: { currencyStrengthDelta: 5, foreignReservesDelta: 5, marketConfidenceDelta: -8 },
      },
      {
        id: 'eco_005_d',
        textKey: 'event.eco_005.choice_d',
        effects: { currencyStrengthDelta: 8, deficitDelta: 3, foreignReservesDelta: 5 },
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
      {
        id: 'eco_006_c',
        textKey: 'event.eco_006.choice_c',
        effects: { foreignReservesDelta: 5, deficitDelta: 2, popularityDelta: 3 },
      },
      {
        id: 'eco_006_d',
        textKey: 'event.eco_006.choice_d',
        effects: { foreignReservesDelta: 4, deficitDelta: 4, marketConfidenceDelta: 3 },
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
      {
        id: 'eco_007_c',
        textKey: 'event.eco_007.choice_c',
        effects: { gdpGrowthDelta: 1, deficitDelta: 5, marketConfidenceDelta: 5 },
      },
      {
        id: 'eco_007_d',
        textKey: 'event.eco_007.choice_d',
        effects: { gdpGrowthDelta: 0.8, marketConfidenceDelta: 8, deficitDelta: -5 },
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
      {
        id: 'eco_008_c',
        textKey: 'event.eco_008.choice_c',
        effects: { marketConfidenceDelta: 5, deficitDelta: -3, popularityDelta: -3 },
      },
      {
        id: 'eco_008_d',
        textKey: 'event.eco_008.choice_d',
        effects: { deficitDelta: -4, marketConfidenceDelta: 3, stabilityDelta: 2 },
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
      {
        id: 'eco_009_c',
        textKey: 'event.eco_009.choice_c',
        effects: { inflationDelta: -5, popularityDelta: -3, deficitDelta: -4 },
      },
      {
        id: 'eco_009_d',
        textKey: 'event.eco_009.choice_d',
        effects: { foreignReservesDelta: 8, deficitDelta: 3, marketConfidenceDelta: 5 },
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
      {
        id: 'eco_010_c',
        textKey: 'event.eco_010.choice_c',
        effects: { deficitDelta: 3, marketConfidenceDelta: -3, foreignReservesDelta: 3 },
      },
      {
        id: 'eco_010_d',
        textKey: 'event.eco_010.choice_d',
        effects: { deficitDelta: -5, marketConfidenceDelta: 8, popularityDelta: -6 },
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
      {
        id: 'eco_011_c',
        textKey: 'event.eco_011.choice_c',
        effects: { currencyStrengthDelta: 5, deficitDelta: 4, marketConfidenceDelta: 5 },
      },
      {
        id: 'eco_011_d',
        textKey: 'event.eco_011.choice_d',
        effects: { foreignReservesDelta: 5, currencyStrengthDelta: 3, marketConfidenceDelta: 5 },
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
      {
        id: 'eco_012_c',
        textKey: 'event.eco_012.choice_c',
        effects: { popularityDelta: 7, gdpGrowthDelta: 1, deficitDelta: 5 },
      },
      {
        id: 'eco_012_d',
        textKey: 'event.eco_012.choice_d',
        effects: { marketConfidenceDelta: 8, gdpGrowthDelta: 1, deficitDelta: 3 },
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
      {
        id: 'eco_013_c',
        textKey: 'event.eco_013.choice_c',
        effects: { marketConfidenceDelta: 8, deficitDelta: -5, popularityDelta: -3 },
      },
      {
        id: 'eco_013_d',
        textKey: 'event.eco_013.choice_d',
        effects: { marketConfidenceDelta: 10, deficitDelta: -3, foreignReservesDelta: 3 },
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
      {
        id: 'eco_014_c',
        textKey: 'event.eco_014.choice_c',
        effects: { popularityDelta: 5, deficitDelta: -3, stabilityDelta: 4 },
      },
      {
        id: 'eco_014_d',
        textKey: 'event.eco_014.choice_d',
        effects: { popularityDelta: 2, deficitDelta: -4, marketConfidenceDelta: 5 },
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
      {
        id: 'eco_015_c',
        textKey: 'event.eco_015.choice_c',
        effects: { foreignReservesDelta: 5, marketConfidenceDelta: 5, deficitDelta: -5 },
      },
      {
        id: 'eco_015_d',
        textKey: 'event.eco_015.choice_d',
        effects: { foreignReservesDelta: -5, popularityDelta: -8, marketConfidenceDelta: -15 },
      },
    ],
  },
];
// ─── Chained consequence cards ─────────────────────────────────────────────────
export const ECONOMIC_CHAINED_CARDS: EventCard[] = [
  {
    id: 'eco_chain_001',
    category: 'economic',
    titleKey: 'event.eco_chain_001.title',
    bodyKey: 'event.eco_chain_001.body',
    weight: 6,
    minTurn: 4,
    requiredFlags: ['min_plan_discussed'],
    choices: [
      {
        id: 'eco_chain_001_a',
        textKey: 'event.eco_chain_001.choice_a',
        effects: { inflationDelta: -8, marketConfidenceDelta: 15, popularityDelta: -6 },
      },
      {
        id: 'eco_chain_001_b',
        textKey: 'event.eco_chain_001.choice_b',
        effects: { inflationDelta: 5, deficitDelta: 6, popularityDelta: 10 },
      },
      {
        id: 'eco_chain_001_c',
        textKey: 'event.eco_chain_001.choice_c',
        effects: { inflationDelta: -4, deficitDelta: -3, marketConfidenceDelta: 6 },
      },
      {
        id: 'eco_chain_001_d',
        textKey: 'event.eco_chain_001.choice_d',
        effects: { inflationDelta: -2, marketConfidenceDelta: 8, stabilityDelta: 3 },
        requiresVote: true,
        voteChance: 0.5,
      },
    ],
  },
  {
    id: 'eco_chain_002',
    category: 'economic',
    titleKey: 'event.eco_chain_002.title',
    bodyKey: 'event.eco_chain_002.body',
    weight: 5,
    minTurn: 6,
    requiredFlags: ['gob_confronted'],
    memoryFlagAdded: 'fiscal_war',
    choices: [
      {
        id: 'eco_chain_002_a',
        textKey: 'event.eco_chain_002.choice_a',
        effects: { deficitDelta: -10, marketConfidenceDelta: 8, popularityDelta: -4 },
      },
      {
        id: 'eco_chain_002_b',
        textKey: 'event.eco_chain_002.choice_b',
        effects: { deficitDelta: 8, popularityDelta: 12, stabilityDelta: -4 },
      },
      {
        id: 'eco_chain_002_c',
        textKey: 'event.eco_chain_002.choice_c',
        effects: { deficitDelta: -4, stabilityDelta: 5, popularityDelta: 4 },
      },
      {
        id: 'eco_chain_002_d',
        textKey: 'event.eco_chain_002.choice_d',
        effects: { deficitDelta: -6, gdpGrowthDelta: 0.4, marketConfidenceDelta: 5 },
        requiresVote: true,
        voteChance: 0.45,
      },
    ],
  },
  {
    id: 'eco_chain_003',
    category: 'economic',
    titleKey: 'event.eco_chain_003.title',
    bodyKey: 'event.eco_chain_003.body',
    weight: 5,
    minTurn: 9,
    requiredFlags: ['fiscal_war'],
    choices: [
      {
        id: 'eco_chain_003_a',
        textKey: 'event.eco_chain_003.choice_a',
        effects: { foreignReservesDelta: -10, inflationDelta: 8, popularityDelta: -5 },
      },
      {
        id: 'eco_chain_003_b',
        textKey: 'event.eco_chain_003.choice_b',
        effects: { foreignReservesDelta: 5, inflationDelta: -4, popularityDelta: 8, deficitDelta: 5 },
      },
      {
        id: 'eco_chain_003_c',
        textKey: 'event.eco_chain_003.choice_c',
        effects: { foreignReservesDelta: -3, inflationDelta: -2, marketConfidenceDelta: 10 },
      },
      {
        id: 'eco_chain_003_d',
        textKey: 'event.eco_chain_003.choice_d',
        effects: { foreignReservesDelta: 8, inflationDelta: -6, marketConfidenceDelta: 12, deficitDelta: -4 },
      },
    ],
  },
];