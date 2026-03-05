import type { EventCard } from '../types.js';

export const SOCIAL_CARDS: EventCard[] = [
  {
    id: 'soc_001',
    category: 'social',
    titleKey: 'event.soc_001.title',
    bodyKey: 'event.soc_001.body',
    weight: 10,
    choices: [
      {
        id: 'soc_001_a',
        textKey: 'event.soc_001.choice_a',
        effects: { stabilityDelta: 15, popularityDelta: 8 },
      },
      {
        id: 'soc_001_b',
        textKey: 'event.soc_001.choice_b',
        effects: { stabilityDelta: -10, popularityDelta: -8, mediaCredibilityDelta: -5 },
      },
      {
        id: 'soc_001_c',
        textKey: 'event.soc_001.choice_c',
        effects: { stabilityDelta: 4, popularityDelta: 3 },
      },
    ],
  },
  {
    id: 'soc_002',
    category: 'social',
    titleKey: 'event.soc_002.title',
    bodyKey: 'event.soc_002.body',
    weight: 9,
    choices: [
      {
        id: 'soc_002_a',
        textKey: 'event.soc_002.choice_a',
        effects: { popularityDelta: 14, stabilityDelta: 5 },
      },
      {
        id: 'soc_002_b',
        textKey: 'event.soc_002.choice_b',
        effects: { popularityDelta: -8, stabilityDelta: -1 },
      },
    ],
  },
  {
    id: 'soc_003',
    category: 'social',
    titleKey: 'event.soc_003.title',
    bodyKey: 'event.soc_003.body',
    weight: 8,
    choices: [
      {
        id: 'soc_003_a',
        textKey: 'event.soc_003.choice_a',
        effects: { stabilityDelta: -15, popularityDelta: -10, mediaCredibilityDelta: 5 },
      },
      {
        id: 'soc_003_b',
        textKey: 'event.soc_003.choice_b',
        effects: { stabilityDelta: 5, popularityDelta: 3, deficitDelta: 5 },
      },
    ],
  },
  {
    id: 'soc_004',
    category: 'social',
    titleKey: 'event.soc_004.title',
    bodyKey: 'event.soc_004.body',
    weight: 9,
    minTurn: 5,
    choices: [
      {
        id: 'soc_004_a',
        textKey: 'event.soc_004.choice_a',
        effects: { popularityDelta: 12, stabilityDelta: 13 },
        requiresVote: true,
        voteChance: 0.45,
      },
      {
        id: 'soc_004_b',
        textKey: 'event.soc_004.choice_b',
        effects: { popularityDelta: -6, stabilityDelta: -4 },
      },
    ],
  },
  {
    id: 'soc_005',
    category: 'social',
    titleKey: 'event.soc_005.title',
    bodyKey: 'event.soc_005.body',
    weight: 8,
    choices: [
      {
        id: 'soc_005_a',
        textKey: 'event.soc_005.choice_a',
        effects: { mediaCredibilityDelta: 8, stabilityDelta: 5, popularityDelta: 4 },
      },
      {
        id: 'soc_005_b',
        textKey: 'event.soc_005.choice_b',
        effects: { mediaCredibilityDelta: -12, stabilityDelta: -8, popularityDelta: 8 },
      },
    ],
  },
  {
    id: 'soc_006',
    category: 'social',
    titleKey: 'event.soc_006.title',
    bodyKey: 'event.soc_006.body',
    weight: 7,
    minTurn: 8,
    choices: [
      {
        id: 'soc_006_a',
        textKey: 'event.soc_006.choice_a',
        effects: { popularityDelta: 15, stabilityDelta: 6 },
      },
      {
        id: 'soc_006_b',
        textKey: 'event.soc_006.choice_b',
        effects: { popularityDelta: -8, stabilityDelta: -10 },
      },
    ],
  },
  {
    id: 'soc_007',
    category: 'social',
    titleKey: 'event.soc_007.title',
    bodyKey: 'event.soc_007.body',
    weight: 9,
    choices: [
      {
        id: 'soc_007_a',
        textKey: 'event.soc_007.choice_a',
        effects: { stabilityDelta: 12, popularityDelta: 6 },
      },
      {
        id: 'soc_007_b',
        textKey: 'event.soc_007.choice_b',
        effects: { stabilityDelta: -8, popularityDelta: -5, mediaCredibilityDelta: 8 },
      },
    ],
  },
  {
    id: 'soc_008',
    category: 'social',
    titleKey: 'event.soc_008.title',
    bodyKey: 'event.soc_008.body',
    weight: 8,
    choices: [
      {
        id: 'soc_008_a',
        textKey: 'event.soc_008.choice_a',
        effects: { popularityDelta: 8, stabilityDelta: 9 },
      },
      {
        id: 'soc_008_b',
        textKey: 'event.soc_008.choice_b',
        effects: { popularityDelta: -5, stabilityDelta: 1 },
      },
    ],
  },
  {
    id: 'soc_009',
    category: 'social',
    titleKey: 'event.soc_009.title',
    bodyKey: 'event.soc_009.body',
    weight: 7,
    minTurn: 10,
    choices: [
      {
        id: 'soc_009_a',
        textKey: 'event.soc_009.choice_a',
        effects: { stabilityDelta: -12, popularityDelta: -5, mediaCredibilityDelta: -8 },
      },
      {
        id: 'soc_009_b',
        textKey: 'event.soc_009.choice_b',
        effects: { stabilityDelta: 11, popularityDelta: 5 },
      },
    ],
  },
  {
    id: 'soc_010',
    category: 'social',
    titleKey: 'event.soc_010.title',
    bodyKey: 'event.soc_010.body',
    weight: 10,
    choices: [
      {
        id: 'soc_010_a',
        textKey: 'event.soc_010.choice_a',
        effects: { popularityDelta: 5, stabilityDelta: 3, mediaCredibilityDelta: 4 },
      },
      {
        id: 'soc_010_b',
        textKey: 'event.soc_010.choice_b',
        effects: { popularityDelta: -3, stabilityDelta: 8 },
      },
    ],
  },
  {
    id: 'soc_011',
    category: 'social',
    titleKey: 'event.soc_011.title',
    bodyKey: 'event.soc_011.body',
    weight: 8,
    minTurn: 6,
    choices: [
      {
        id: 'soc_011_a',
        textKey: 'event.soc_011.choice_a',
        effects: { popularityDelta: 10, stabilityDelta: 10 },
      },
      {
        id: 'soc_011_b',
        textKey: 'event.soc_011.choice_b',
        effects: { popularityDelta: -1, stabilityDelta: -1 },
      },
    ],
  },
  {
    id: 'soc_012',
    category: 'social',
    titleKey: 'event.soc_012.title',
    bodyKey: 'event.soc_012.body',
    weight: 7,
    choices: [
      {
        id: 'soc_012_a',
        textKey: 'event.soc_012.choice_a',
        effects: { stabilityDelta: 20, popularityDelta: 8 },
        requiresVote: true,
        voteChance: 0.4,
      },
      {
        id: 'soc_012_b',
        textKey: 'event.soc_012.choice_b',
        effects: { stabilityDelta: -5, popularityDelta: -3 },
      },
    ],
  },
  {
    id: 'soc_013',
    category: 'social',
    titleKey: 'event.soc_013.title',
    bodyKey: 'event.soc_013.body',
    weight: 9,
    choices: [
      {
        id: 'soc_013_a',
        textKey: 'event.soc_013.choice_a',
        effects: { popularityDelta: 12, stabilityDelta: 11 },
      },
      {
        id: 'soc_013_b',
        textKey: 'event.soc_013.choice_b',
        effects: { popularityDelta: -8, stabilityDelta: -5, mediaCredibilityDelta: 10 },
      },
    ],
  },
  {
    id: 'soc_014',
    category: 'social',
    titleKey: 'event.soc_014.title',
    bodyKey: 'event.soc_014.body',
    weight: 8,
    minTurn: 12,
    choices: [
      {
        id: 'soc_014_a',
        textKey: 'event.soc_014.choice_a',
        effects: { stabilityDelta: 10, mediaCredibilityDelta: 8, popularityDelta: 5 },
      },
      {
        id: 'soc_014_b',
        textKey: 'event.soc_014.choice_b',
        effects: { stabilityDelta: -8, popularityDelta: 10, deficitDelta: 5 },
      },
    ],
  },
  {
    id: 'soc_015',
    category: 'social',
    titleKey: 'event.soc_015.title',
    bodyKey: 'event.soc_015.body',
    weight: 7,
    choices: [
      {
        id: 'soc_015_a',
        textKey: 'event.soc_015.choice_a',
        effects: { popularityDelta: 8, stabilityDelta: 8 },
      },
      {
        id: 'soc_015_b',
        textKey: 'event.soc_015.choice_b',
        effects: { popularityDelta: -5, stabilityDelta: 2 },
      },
    ],
  },
];
