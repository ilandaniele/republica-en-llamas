import type { EventCard } from '../types.js';

/**
 * Geopolitical event cards — international crises and global shocks.
 * Cards with requiredFlags are scoped to specific geopolitical scenarios.
 * General international cards (no requiredFlags) can appear in any run.
 */
export const GEOPOLITICAL_CARDS: EventCard[] = [
  // ── Shared international cards (appear in any scenario) ─────────────────────

  {
    id: 'geo_001',
    category: 'international',
    titleKey: 'event.geo_001.title',
    bodyKey: 'event.geo_001.body',
    weight: 18,
    minTurn: 3,
    choices: [
      {
        id: 'geo_001_a',
        textKey: 'event.geo_001.choice_a',
        effects: { inflationDelta: 8, foreignReservesDelta: -10, marketConfidenceDelta: -8 },
      },
      {
        id: 'geo_001_b',
        textKey: 'event.geo_001.choice_b',
        effects: { inflationDelta: 4, deficitDelta: 8, popularityDelta: -5 },
      },
      {
        id: 'geo_001_c',
        textKey: 'event.geo_001.choice_c',
        effects: { inflationDelta: 2, foreignReservesDelta: -5, marketConfidenceDelta: 5 },
      },
      {
        id: 'geo_001_d',
        textKey: 'event.geo_001.choice_d',
        effects: { popularityDelta: -8, marketConfidenceDelta: 12, inflationDelta: -2 },
      },
    ],
  },

  {
    id: 'geo_007',
    category: 'international',
    titleKey: 'event.geo_007.title',
    bodyKey: 'event.geo_007.body',
    weight: 15,
    minTurn: 5,
    choices: [
      {
        id: 'geo_007_a',
        textKey: 'event.geo_007.choice_a',
        effects: { marketConfidenceDelta: 15, foreignReservesDelta: 10, popularityDelta: -8 },
      },
      {
        id: 'geo_007_b',
        textKey: 'event.geo_007.choice_b',
        effects: { popularityDelta: 10, marketConfidenceDelta: -12, deficitDelta: 5 },
      },
      {
        id: 'geo_007_c',
        textKey: 'event.geo_007.choice_c',
        effects: { marketConfidenceDelta: 5, popularityDelta: 2, foreignReservesDelta: 3 },
      },
    ],
  },

  {
    id: 'geo_008',
    category: 'international',
    titleKey: 'event.geo_008.title',
    bodyKey: 'event.geo_008.body',
    weight: 14,
    minTurn: 8,
    choices: [
      {
        id: 'geo_008_a',
        textKey: 'event.geo_008.choice_a',
        effects: { deficitDelta: -10, popularityDelta: -12, marketConfidenceDelta: 15 },
      },
      {
        id: 'geo_008_b',
        textKey: 'event.geo_008.choice_b',
        effects: { deficitDelta: -5, popularityDelta: -6, inflationDelta: -3 },
      },
      {
        id: 'geo_008_c',
        textKey: 'event.geo_008.choice_c',
        effects: { popularityDelta: 5, deficitDelta: 5, marketConfidenceDelta: -10 },
      },
    ],
  },

  // ── Ukraine War scenario cards ────────────────────────────────────────────

  {
    id: 'geo_002',
    category: 'international',
    titleKey: 'event.geo_002.title',
    bodyKey: 'event.geo_002.body',
    weight: 22,
    minTurn: 1,
    requiredFlags: ['scenario_guerra_ucrania_2022'],
    choices: [
      {
        id: 'geo_002_a',
        textKey: 'event.geo_002.choice_a',
        effects: { inflationDelta: 6, popularityDelta: -4, foreignReservesDelta: -8 },
      },
      {
        id: 'geo_002_b',
        textKey: 'event.geo_002.choice_b',
        effects: { inflationDelta: 10, popularityDelta: 5, currencyStrengthDelta: -8 },
      },
      {
        id: 'geo_002_c',
        textKey: 'event.geo_002.choice_c',
        effects: { inflationDelta: 3, deficitDelta: 6, marketConfidenceDelta: -5 },
      },
      {
        id: 'geo_002_d',
        textKey: 'event.geo_002.choice_d',
        effects: { marketConfidenceDelta: 10, foreignReservesDelta: 5, popularityDelta: -10 },
      },
    ],
  },

  {
    id: 'geo_003',
    category: 'international',
    titleKey: 'event.geo_003.title',
    bodyKey: 'event.geo_003.body',
    weight: 18,
    minTurn: 3,
    requiredFlags: ['scenario_guerra_ucrania_2022'],
    choices: [
      {
        id: 'geo_003_a',
        textKey: 'event.geo_003.choice_a',
        effects: { marketConfidenceDelta: 12, popularityDelta: -5, deficitDelta: 8 },
      },
      {
        id: 'geo_003_b',
        textKey: 'event.geo_003.choice_b',
        effects: { popularityDelta: 8, marketConfidenceDelta: -15, foreignReservesDelta: -5 },
      },
      {
        id: 'geo_003_c',
        textKey: 'event.geo_003.choice_c',
        effects: { popularityDelta: 3, marketConfidenceDelta: 3, deficitDelta: 3 },
      },
    ],
  },

  {
    id: 'geo_004',
    category: 'international',
    titleKey: 'event.geo_004.title',
    bodyKey: 'event.geo_004.body',
    weight: 16,
    minTurn: 4,
    requiredFlags: ['scenario_guerra_ucrania_2022'],
    choices: [
      {
        id: 'geo_004_a',
        textKey: 'event.geo_004.choice_a',
        effects: { marketConfidenceDelta: -10, foreignReservesDelta: -8, popularityDelta: 5 },
      },
      {
        id: 'geo_004_b',
        textKey: 'event.geo_004.choice_b',
        effects: { marketConfidenceDelta: 8, popularityDelta: -10, currencyStrengthDelta: 5 },
      },
      {
        id: 'geo_004_c',
        textKey: 'event.geo_004.choice_c',
        effects: { deficitDelta: 4, popularityDelta: -3, marketConfidenceDelta: -4 },
      },
    ],
  },

  // ── Iran Conflict scenario cards ──────────────────────────────────────────

  {
    id: 'geo_005',
    category: 'international',
    titleKey: 'event.geo_005.title',
    bodyKey: 'event.geo_005.body',
    weight: 22,
    minTurn: 1,
    requiredFlags: ['scenario_conflicto_iran_2024'],
    choices: [
      {
        id: 'geo_005_a',
        textKey: 'event.geo_005.choice_a',
        effects: { inflationDelta: 10, currencyStrengthDelta: -8, foreignReservesDelta: -10 },
      },
      {
        id: 'geo_005_b',
        textKey: 'event.geo_005.choice_b',
        effects: { inflationDelta: 5, deficitDelta: 10, popularityDelta: 3 },
      },
      {
        id: 'geo_005_c',
        textKey: 'event.geo_005.choice_c',
        effects: { marketConfidenceDelta: -8, inflationDelta: 2, popularityDelta: -5 },
      },
      {
        id: 'geo_005_d',
        textKey: 'event.geo_005.choice_d',
        effects: { marketConfidenceDelta: 10, inflationDelta: -2, foreignReservesDelta: 5 },
      },
    ],
  },

  {
    id: 'geo_006',
    category: 'social',
    titleKey: 'event.geo_006.title',
    bodyKey: 'event.geo_006.body',
    weight: 14,
    minTurn: 5,
    requiredFlags: ['scenario_conflicto_iran_2024'],
    choices: [
      {
        id: 'geo_006_a',
        textKey: 'event.geo_006.choice_a',
        effects: { popularityDelta: 8, deficitDelta: 5, stabilityDelta: 5 },
      },
      {
        id: 'geo_006_b',
        textKey: 'event.geo_006.choice_b',
        effects: { popularityDelta: -8, stabilityDelta: -5, marketConfidenceDelta: 5 },
      },
      {
        id: 'geo_006_c',
        textKey: 'event.geo_006.choice_c',
        effects: { popularityDelta: 2, deficitDelta: 2, stabilityDelta: 2 },
      },
    ],
  },
];
