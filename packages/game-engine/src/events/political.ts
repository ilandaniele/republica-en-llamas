import type { EventCard } from '../types.js';

export const POLITICAL_CARDS: EventCard[] = [
  {
    id: 'pol_001',
    category: 'political',
    titleKey: 'event.pol_001.title',
    bodyKey: 'event.pol_001.body',
    weight: 10,
    choices: [
      {
        id: 'pol_001_a',
        textKey: 'event.pol_001.choice_a',
        effects: { popularityDelta: 8, stabilityDelta: -3, mediaCredibilityDelta: 5 },
      },
      {
        id: 'pol_001_b',
        textKey: 'event.pol_001.choice_b',
        effects: { popularityDelta: -5, stabilityDelta: 8, mediaCredibilityDelta: 10 },
      },
      {
        id: 'pol_001_c',
        textKey: 'event.pol_001.choice_c',
        effects: { popularityDelta: 3, stabilityDelta: 5 },
      },
      {
        id: 'pol_001_d',
        textKey: 'event.pol_001.choice_d',
        effects: { popularityDelta: 5, stabilityDelta: 3, mediaCredibilityDelta: 8 },
      },
    ],
  },
  {
    id: 'pol_002',
    category: 'political',
    titleKey: 'event.pol_002.title',
    bodyKey: 'event.pol_002.body',
    weight: 9,
    choices: [
      {
        id: 'pol_002_a',
        textKey: 'event.pol_002.choice_a',
        effects: { popularityDelta: 10, stabilityDelta: 5 },
      },
      {
        id: 'pol_002_b',
        textKey: 'event.pol_002.choice_b',
        effects: { popularityDelta: -8, stabilityDelta: -5, mediaCredibilityDelta: 8 },
      },
      {
        id: 'pol_002_c',
        textKey: 'event.pol_002.choice_c',
        effects: { stabilityDelta: 5, popularityDelta: 2, deficitDelta: 2 },
      },
      {
        id: 'pol_002_d',
        textKey: 'event.pol_002.choice_d',
        effects: { stabilityDelta: 8, popularityDelta: -5, mediaCredibilityDelta: -3 },
      },
    ],
  },
  {
    id: 'pol_003',
    category: 'political',
    titleKey: 'event.pol_003.title',
    bodyKey: 'event.pol_003.body',
    weight: 8,
    choices: [
      {
        id: 'pol_003_a',
        textKey: 'event.pol_003.choice_a',
        effects: { governmentSeatsDelta: 10, popularityDelta: 5, stabilityDelta: -3 },
      },
      {
        id: 'pol_003_b',
        textKey: 'event.pol_003.choice_b',
        effects: { popularityDelta: -3, mediaCredibilityDelta: 12, stabilityDelta: 5 },
      },
      {
        id: 'pol_003_c',
        textKey: 'event.pol_003.choice_c',
        effects: { governmentSeatsDelta: 5, deficitDelta: 3, popularityDelta: -2 },
      },
      {
        id: 'pol_003_d',
        textKey: 'event.pol_003.choice_d',
        effects: { governmentSeatsDelta: -5, stabilityDelta: 3, mediaCredibilityDelta: 5 },
      },
    ],
  },
  {
    id: 'pol_004',
    category: 'political',
    titleKey: 'event.pol_004.title',
    bodyKey: 'event.pol_004.body',
    weight: 7,
    minTurn: 5,
    choices: [
      {
        id: 'pol_004_a',
        textKey: 'event.pol_004.choice_a',
        effects: { popularityDelta: 12, stabilityDelta: -8, mediaCredibilityDelta: -5 },
      },
      {
        id: 'pol_004_b',
        textKey: 'event.pol_004.choice_b',
        effects: { popularityDelta: -5, stabilityDelta: 5, mediaCredibilityDelta: 8 },
      },
      {
        id: 'pol_004_c',
        textKey: 'event.pol_004.choice_c',
        effects: { popularityDelta: 2, deficitDelta: 4, lawsPassedDelta: 1 },
        requiresVote: true,
        voteChance: 0.5,
      },
      {
        id: 'pol_004_d',
        textKey: 'event.pol_004.choice_d',
        effects: { popularityDelta: 8, stabilityDelta: 3, lawsPassedDelta: 1, deficitDelta: 2 },
      },
    ],
  },
  {
    id: 'pol_005',
    category: 'political',
    titleKey: 'event.pol_005.title',
    bodyKey: 'event.pol_005.body',
    weight: 8,
    choices: [
      {
        id: 'pol_005_a',
        textKey: 'event.pol_005.choice_a',
        effects: { mediaCredibilityDelta: -20, popularityDelta: 3 },
      },
      {
        id: 'pol_005_b',
        textKey: 'event.pol_005.choice_b',
        effects: { mediaCredibilityDelta: 15, popularityDelta: -10, stabilityDelta: -5 },
      },
      {
        id: 'pol_005_c',
        textKey: 'event.pol_005.choice_c',
        effects: { mediaCredibilityDelta: 10, popularityDelta: 2, deficitDelta: 2 },
      },
      {
        id: 'pol_005_d',
        textKey: 'event.pol_005.choice_d',
        effects: { mediaCredibilityDelta: 5, popularityDelta: 4, stabilityDelta: -2 },
      },
    ],
  },
  {
    id: 'pol_006',
    category: 'political',
    titleKey: 'event.pol_006.title',
    bodyKey: 'event.pol_006.body',
    weight: 9,
    minTurn: 3,
    choices: [
      {
        id: 'pol_006_a',
        textKey: 'event.pol_006.choice_a',
        effects: { popularityDelta: 15, stabilityDelta: 9 },
      },
      {
        id: 'pol_006_b',
        textKey: 'event.pol_006.choice_b',
        effects: { popularityDelta: -3, deficitDelta: -3, marketConfidenceDelta: 5 },
      },
      {
        id: 'pol_006_c',
        textKey: 'event.pol_006.choice_c',
        effects: { popularityDelta: 8, deficitDelta: 2, stabilityDelta: 3 },
      },
      {
        id: 'pol_006_d',
        textKey: 'event.pol_006.choice_d',
        effects: { popularityDelta: 5, deficitDelta: 3, stabilityDelta: 2 },
      },
    ],
  },
  {
    id: 'pol_007',
    category: 'political',
    titleKey: 'event.pol_007.title',
    bodyKey: 'event.pol_007.body',
    weight: 6,
    minTurn: 8,
    choices: [
      {
        id: 'pol_007_a',
        textKey: 'event.pol_007.choice_a',
        effects: { governmentSeatsDelta: -15, popularityDelta: -8, stabilityDelta: -5 },
      },
      {
        id: 'pol_007_b',
        textKey: 'event.pol_007.choice_b',
        effects: { popularityDelta: 5, stabilityDelta: 11 },
      },
      {
        id: 'pol_007_c',
        textKey: 'event.pol_007.choice_c',
        effects: { popularityDelta: 3, stabilityDelta: 8, mediaCredibilityDelta: 4 },
      },
      {
        id: 'pol_007_d',
        textKey: 'event.pol_007.choice_d',
        effects: { popularityDelta: 2, stabilityDelta: 6, mediaCredibilityDelta: 5 },
      },
    ],
  },
  {
    id: 'pol_008',
    category: 'political',
    titleKey: 'event.pol_008.title',
    bodyKey: 'event.pol_008.body',
    weight: 10,
    choices: [
      {
        id: 'pol_008_a',
        textKey: 'event.pol_008.choice_a',
        effects: { popularityDelta: 6, stabilityDelta: 4, mediaCredibilityDelta: 3 },
      },
      {
        id: 'pol_008_b',
        textKey: 'event.pol_008.choice_b',
        effects: { popularityDelta: -4, stabilityDelta: -5 },
      },
      {
        id: 'pol_008_c',
        textKey: 'event.pol_008.choice_c',
        effects: { popularityDelta: 5, stabilityDelta: 3, mediaCredibilityDelta: 4 },
      },
      {
        id: 'pol_008_d',
        textKey: 'event.pol_008.choice_d',
        effects: { popularityDelta: 3, stabilityDelta: 5, mediaCredibilityDelta: 5 },
      },
    ],
  },
  {
    id: 'pol_009',
    category: 'political',
    titleKey: 'event.pol_009.title',
    bodyKey: 'event.pol_009.body',
    weight: 7,
    minTurn: 10,
    choices: [
      {
        id: 'pol_009_a',
        textKey: 'event.pol_009.choice_a',
        effects: { lawsPassedDelta: 2, popularityDelta: 8, stabilityDelta: 6 },
        requiresVote: true,
        voteChance: 0.4,
      },
      {
        id: 'pol_009_b',
        textKey: 'event.pol_009.choice_b',
        effects: { emergencyDecreeDelta: 1, popularityDelta: -5, stabilityDelta: -5 },
      },
      {
        id: 'pol_009_c',
        textKey: 'event.pol_009.choice_c',
        effects: { deficitDelta: -3, foreignReservesDelta: 5, marketConfidenceDelta: 8 },
      },
      {
        id: 'pol_009_d',
        textKey: 'event.pol_009.choice_d',
        effects: { popularityDelta: 5, deficitDelta: -2, stabilityDelta: 3 },
      },
    ],
  },
  {
    id: 'pol_010',
    category: 'political',
    titleKey: 'event.pol_010.title',
    bodyKey: 'event.pol_010.body',
    weight: 8,
    choices: [
      {
        id: 'pol_010_a',
        textKey: 'event.pol_010.choice_a',
        effects: { mediaCredibilityDelta: 10, popularityDelta: 5, stabilityDelta: 3 },
      },
      {
        id: 'pol_010_b',
        textKey: 'event.pol_010.choice_b',
        effects: { mediaCredibilityDelta: -8, popularityDelta: -3, stabilityDelta: 8 },
      },
      {
        id: 'pol_010_c',
        textKey: 'event.pol_010.choice_c',
        effects: { popularityDelta: 4, stabilityDelta: 5, mediaCredibilityDelta: 5 },
      },
      {
        id: 'pol_010_d',
        textKey: 'event.pol_010.choice_d',
        effects: { popularityDelta: 5, stabilityDelta: 6, mediaCredibilityDelta: 3 },
      },
    ],
  },
  {
    id: 'pol_011',
    category: 'political',
    titleKey: 'event.pol_011.title',
    bodyKey: 'event.pol_011.body',
    weight: 9,
    minTurn: 6,
    choices: [
      {
        id: 'pol_011_a',
        textKey: 'event.pol_011.choice_a',
        effects: { popularityDelta: 14, stabilityDelta: 5 },
      },
      {
        id: 'pol_011_b',
        textKey: 'event.pol_011.choice_b',
        effects: { popularityDelta: -2, stabilityDelta: 5 },
      },
      {
        id: 'pol_011_c',
        textKey: 'event.pol_011.choice_c',
        effects: { popularityDelta: 8, stabilityDelta: 5, deficitDelta: 4 },
      },
      {
        id: 'pol_011_d',
        textKey: 'event.pol_011.choice_d',
        effects: { popularityDelta: 6, deficitDelta: 3, marketConfidenceDelta: 3 },
      },
    ],
  },
  {
    id: 'pol_012',
    category: 'political',
    titleKey: 'event.pol_012.title',
    bodyKey: 'event.pol_012.body',
    weight: 6,
    minTurn: 15,
    choices: [
      {
        id: 'pol_012_a',
        textKey: 'event.pol_012.choice_a',
        effects: { popularityDelta: 15, stabilityDelta: 16 },
      },
      {
        id: 'pol_012_b',
        textKey: 'event.pol_012.choice_b',
        effects: { popularityDelta: -4, stabilityDelta: 6 },
      },
      {
        id: 'pol_012_c',
        textKey: 'event.pol_012.choice_c',
        effects: { popularityDelta: 5, stabilityDelta: 4, gdpGrowthDelta: 0.5 },
      },
      {
        id: 'pol_012_d',
        textKey: 'event.pol_012.choice_d',
        effects: { popularityDelta: 4, stabilityDelta: 3, mediaCredibilityDelta: 5 },
      },
    ],
  },
  {
    id: 'pol_013',
    category: 'political',
    titleKey: 'event.pol_013.title',
    bodyKey: 'event.pol_013.body',
    weight: 8,
    choices: [
      {
        id: 'pol_013_a',
        textKey: 'event.pol_013.choice_a',
        effects: { stabilityDelta: 8, mediaCredibilityDelta: 5, popularityDelta: 3 },
      },
      {
        id: 'pol_013_b',
        textKey: 'event.pol_013.choice_b',
        effects: { stabilityDelta: -2, popularityDelta: 10 },
      },
      {
        id: 'pol_013_c',
        textKey: 'event.pol_013.choice_c',
        effects: { stabilityDelta: 5, mediaCredibilityDelta: 8, popularityDelta: 2 },
      },
      {
        id: 'pol_013_d',
        textKey: 'event.pol_013.choice_d',
        effects: { stabilityDelta: 6, popularityDelta: 5, mediaCredibilityDelta: 3 },
      },
    ],
  },
  {
    id: 'pol_014',
    category: 'political',
    titleKey: 'event.pol_014.title',
    bodyKey: 'event.pol_014.body',
    weight: 7,
    minTurn: 12,
    choices: [
      {
        id: 'pol_014_a',
        textKey: 'event.pol_014.choice_a',
        effects: { governmentSeatsDelta: 20, stabilityDelta: -1 },
      },
      {
        id: 'pol_014_b',
        textKey: 'event.pol_014.choice_b',
        effects: { governmentSeatsDelta: -10, popularityDelta: 8, mediaCredibilityDelta: 10 },
      },
      {
        id: 'pol_014_c',
        textKey: 'event.pol_014.choice_c',
        effects: { governmentSeatsDelta: 8, popularityDelta: 3, mediaCredibilityDelta: -2 },
      },
      {
        id: 'pol_014_d',
        textKey: 'event.pol_014.choice_d',
        effects: { governmentSeatsDelta: 3, popularityDelta: 5, mediaCredibilityDelta: 5 },
      },
    ],
  },
  {
    id: 'pol_015',
    category: 'political',
    titleKey: 'event.pol_015.title',
    bodyKey: 'event.pol_015.body',
    weight: 9,
    choices: [
      {
        id: 'pol_015_a',
        textKey: 'event.pol_015.choice_a',
        effects: { popularityDelta: -10, stabilityDelta: 15, mediaCredibilityDelta: 12 },
      },
      {
        id: 'pol_015_b',
        textKey: 'event.pol_015.choice_b',
        effects: { popularityDelta: 8, stabilityDelta: -8, mediaCredibilityDelta: -10 },
      },
      {
        id: 'pol_015_c',
        textKey: 'event.pol_015.choice_c',
        effects: { popularityDelta: 3, stabilityDelta: 5, mediaCredibilityDelta: 8 },
      },
      {
        id: 'pol_015_d',
        textKey: 'event.pol_015.choice_d',
        effects: { popularityDelta: 5, stabilityDelta: 5, mediaCredibilityDelta: 5 },
      },
    ],
  },
  // ─── Presidential election arc ───────────────────────────────────────────
  {
    id: 'pol_election_campaign',
    category: 'political',
    titleKey: 'event.pol_election_campaign.title',
    bodyKey: 'event.pol_election_campaign.body',
    weight: 15,
    minTurn: 36,
    maxTurn: 39,
    choices: [
      {
        id: 'pol_ecampaign_a',
        textKey: 'event.pol_election_campaign.choice_a',
        effects: { popularityDelta: 14, deficitDelta: 5 },
      },
      {
        id: 'pol_ecampaign_b',
        textKey: 'event.pol_election_campaign.choice_b',
        effects: { popularityDelta: 7, stabilityDelta: 6 },
      },
      {
        id: 'pol_ecampaign_c',
        textKey: 'event.pol_election_campaign.choice_c',
        effects: { popularityDelta: 5, mediaCredibilityDelta: 12 },
      },
      {
        id: 'pol_ecampaign_d',
        textKey: 'event.pol_election_campaign.choice_d',
        effects: { popularityDelta: 9, marketConfidenceDelta: 6 },
      },
    ],
  },
  {
    id: 'pol_election_result',
    category: 'political',
    titleKey: 'event.pol_election_result.title',
    bodyKey: 'event.pol_election_result.body',
    weight: 0, // forced draw only — injected by drawNextCard at turn 40
    choices: [
      {
        id: 'pol_eresult_win',
        textKey: 'event.pol_election_result.choice_win',
        effects: { popularityDelta: 16, stabilityDelta: 10, marketConfidenceDelta: 8 },
      },
      {
        id: 'pol_eresult_lose',
        textKey: 'event.pol_election_result.choice_lose',
        effects: { popularityDelta: -18, stabilityDelta: -12, marketConfidenceDelta: -10 },
      },
    ],
  },
];
