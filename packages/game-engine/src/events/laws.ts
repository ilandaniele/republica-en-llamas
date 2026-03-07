import type { EventCard } from '../types.js';

// Each law card has exactly 3 choices:
//   choice_a (index 0) → law passes
//   choice_b (index 1) → law fails
//   choice_c (index 2) → DNU (emergency decree)

const BASE_LAW_CARDS: EventCard[] = [
  {
    id: 'law_001',
    category: 'political',
    titleKey: 'event.law_001.title',
    bodyKey: 'event.law_001.body',
    isLaw: true,
    weight: 6,
    minTurn: 3,
    choices: [
      {
        id: 'law_001_pass',
        textKey: 'event.law_001.choice_a',
        effects: { lawsPassedDelta: 1, marketConfidenceDelta: 8, stabilityDelta: 5, popularityDelta: 6 },
      },
      {
        id: 'law_001_fail',
        textKey: 'event.law_001.choice_b',
        effects: { popularityDelta: -8, stabilityDelta: -10, marketConfidenceDelta: -5 },
      },
      {
        id: 'law_001_decree',
        textKey: 'event.law_001.choice_c',
        effects: { lawsPassedDelta: 1, stabilityDelta: -15, mediaCredibilityDelta: -12, emergencyDecreeDelta: 1 },
      },
    ],
  },
  {
    id: 'law_002',
    category: 'economic',
    titleKey: 'event.law_002.title',
    bodyKey: 'event.law_002.body',
    isLaw: true,
    weight: 6,
    minTurn: 4,
    choices: [
      {
        id: 'law_002_pass',
        textKey: 'event.law_002.choice_a',
        effects: { lawsPassedDelta: 1, marketConfidenceDelta: 10, gdpGrowthDelta: 2, popularityDelta: -4 },
      },
      {
        id: 'law_002_fail',
        textKey: 'event.law_002.choice_b',
        effects: { popularityDelta: -5, marketConfidenceDelta: -6 },
      },
      {
        id: 'law_002_decree',
        textKey: 'event.law_002.choice_c',
        effects: { lawsPassedDelta: 1, marketConfidenceDelta: 8, stabilityDelta: -12, emergencyDecreeDelta: 1 },
      },
    ],
  },
  {
    id: 'law_003',
    category: 'social',
    titleKey: 'event.law_003.title',
    bodyKey: 'event.law_003.body',
    isLaw: true,
    weight: 6,
    minTurn: 5,
    choices: [
      {
        id: 'law_003_pass',
        textKey: 'event.law_003.choice_a',
        effects: { lawsPassedDelta: 1, popularityDelta: 14, stabilityDelta: 10, deficitDelta: 3 },
      },
      {
        id: 'law_003_fail',
        textKey: 'event.law_003.choice_b',
        effects: { popularityDelta: -14, stabilityDelta: -8 },
      },
      {
        id: 'law_003_decree',
        textKey: 'event.law_003.choice_c',
        effects: { lawsPassedDelta: 1, popularityDelta: 8, deficitDelta: 3, stabilityDelta: -6, emergencyDecreeDelta: 1 },
      },
    ],
  },
  {
    id: 'law_004',
    category: 'economic',
    titleKey: 'event.law_004.title',
    bodyKey: 'event.law_004.body',
    isLaw: true,
    weight: 7,
    minTurn: 4,
    choices: [
      {
        id: 'law_004_pass',
        textKey: 'event.law_004.choice_a',
        effects: { lawsPassedDelta: 1, deficitDelta: -3, marketConfidenceDelta: 6 },
      },
      {
        id: 'law_004_fail',
        textKey: 'event.law_004.choice_b',
        effects: { deficitDelta: 5, marketConfidenceDelta: -8, stabilityDelta: -4 },
      },
      {
        id: 'law_004_decree',
        textKey: 'event.law_004.choice_c',
        effects: { lawsPassedDelta: 1, deficitDelta: -2, stabilityDelta: -8, emergencyDecreeDelta: 1 },
      },
    ],
  },
  {
    id: 'law_005',
    category: 'economic',
    titleKey: 'event.law_005.title',
    bodyKey: 'event.law_005.body',
    isLaw: true,
    weight: 5,
    minTurn: 6,
    choices: [
      {
        id: 'law_005_pass',
        textKey: 'event.law_005.choice_a',
        effects: { lawsPassedDelta: 1, deficitDelta: -4, marketConfidenceDelta: 8, popularityDelta: -10 },
      },
      {
        id: 'law_005_fail',
        textKey: 'event.law_005.choice_b',
        effects: { deficitDelta: 4, marketConfidenceDelta: -5, popularityDelta: 4 },
      },
      {
        id: 'law_005_decree',
        textKey: 'event.law_005.choice_c',
        effects: { lawsPassedDelta: 1, deficitDelta: -4, popularityDelta: -18, stabilityDelta: -15, emergencyDecreeDelta: 1 },
      },
    ],
  },
  {
    id: 'law_006',
    category: 'international',
    titleKey: 'event.law_006.title',
    bodyKey: 'event.law_006.body',
    isLaw: true,
    weight: 5,
    minTurn: 5,
    choices: [
      {
        id: 'law_006_pass',
        textKey: 'event.law_006.choice_a',
        effects: { lawsPassedDelta: 1, popularityDelta: 7, marketConfidenceDelta: 6, gdpGrowthDelta: 1 },
      },
      {
        id: 'law_006_fail',
        textKey: 'event.law_006.choice_b',
        effects: { popularityDelta: -4, marketConfidenceDelta: -4 },
      },
      {
        id: 'law_006_decree',
        textKey: 'event.law_006.choice_c',
        effects: { lawsPassedDelta: 1, marketConfidenceDelta: 4, stabilityDelta: -8, emergencyDecreeDelta: 1 },
      },
    ],
  },
  {
    id: 'law_007',
    category: 'economic',
    titleKey: 'event.law_007.title',
    bodyKey: 'event.law_007.body',
    isLaw: true,
    weight: 5,
    minTurn: 6,
    choices: [
      {
        id: 'law_007_pass',
        textKey: 'event.law_007.choice_a',
        effects: { lawsPassedDelta: 1, marketConfidenceDelta: 10, gdpGrowthDelta: 2, popularityDelta: -8, stabilityDelta: -6 },
      },
      {
        id: 'law_007_fail',
        textKey: 'event.law_007.choice_b',
        effects: { popularityDelta: 6, marketConfidenceDelta: -6, stabilityDelta: 4 },
      },
      {
        id: 'law_007_decree',
        textKey: 'event.law_007.choice_c',
        effects: { lawsPassedDelta: 1, marketConfidenceDelta: 8, popularityDelta: -18, stabilityDelta: -14, emergencyDecreeDelta: 1 },
      },
    ],
  },
  {
    id: 'law_008',
    category: 'social',
    titleKey: 'event.law_008.title',
    bodyKey: 'event.law_008.body',
    isLaw: true,
    weight: 5,
    minTurn: 4,
    choices: [
      {
        id: 'law_008_pass',
        textKey: 'event.law_008.choice_a',
        effects: { lawsPassedDelta: 1, stabilityDelta: 8, popularityDelta: -8, marketConfidenceDelta: 4 },
      },
      {
        id: 'law_008_fail',
        textKey: 'event.law_008.choice_b',
        effects: { stabilityDelta: -5, popularityDelta: 3 },
      },
      {
        id: 'law_008_decree',
        textKey: 'event.law_008.choice_c',
        effects: { lawsPassedDelta: 1, stabilityDelta: 5, popularityDelta: -14, mediaCredibilityDelta: -10, emergencyDecreeDelta: 1 },
      },
    ],
  },
];

// ─── Session law cards (forced every 4 turns via drawNextCard) ─────────────────
// 5 cards that rotate in sequence. Same 3-choice structure: pass / fail / DNU.

export const SESSION_LAW_CARDS: EventCard[] = [
  {
    id: 'session_law_001',
    category: 'political',
    titleKey: 'event.session_law_001.title',
    bodyKey: 'event.session_law_001.body',
    isLaw: true,
    weight: 0, // never drawn randomly; only injected by drawNextCard
    choices: [
      {
        id: 'session_law_001_pass',
        textKey: 'event.session_law_001.choice_a',
        effects: { lawsPassedDelta: 1, deficitDelta: -5 },
      },
      {
        id: 'session_law_001_fail',
        textKey: 'event.session_law_001.choice_b',
        effects: { mediaCredibilityDelta: -10 },
      },
      {
        id: 'session_law_001_decree',
        textKey: 'event.session_law_001.choice_c',
        effects: { lawsPassedDelta: 1, deficitDelta: -4, emergencyDecreeDelta: 1, stabilityDelta: -8, mediaCredibilityDelta: -6 },
      },
    ],
  },
  {
    id: 'session_law_002',
    category: 'economic',
    titleKey: 'event.session_law_002.title',
    bodyKey: 'event.session_law_002.body',
    isLaw: true,
    weight: 0,
    choices: [
      {
        id: 'session_law_002_pass',
        textKey: 'event.session_law_002.choice_a',
        effects: { lawsPassedDelta: 1, marketConfidenceDelta: 8, stabilityDelta: -6 },
      },
      {
        id: 'session_law_002_fail',
        textKey: 'event.session_law_002.choice_b',
        effects: { marketConfidenceDelta: -8 },
      },
      {
        id: 'session_law_002_decree',
        textKey: 'event.session_law_002.choice_c',
        effects: { lawsPassedDelta: 1, marketConfidenceDelta: 6, stabilityDelta: -14, emergencyDecreeDelta: 1 },
      },
    ],
  },
  {
    id: 'session_law_003',
    category: 'social',
    titleKey: 'event.session_law_003.title',
    bodyKey: 'event.session_law_003.body',
    isLaw: true,
    weight: 0,
    choices: [
      {
        id: 'session_law_003_pass',
        textKey: 'event.session_law_003.choice_a',
        effects: { lawsPassedDelta: 1, popularityDelta: 5, deficitDelta: 6 },
      },
      {
        id: 'session_law_003_fail',
        textKey: 'event.session_law_003.choice_b',
        effects: { popularityDelta: -8 },
      },
      {
        id: 'session_law_003_decree',
        textKey: 'event.session_law_003.choice_c',
        effects: { lawsPassedDelta: 1, popularityDelta: 3, deficitDelta: 4, stabilityDelta: -10, emergencyDecreeDelta: 1 },
      },
    ],
  },
  {
    id: 'session_law_004',
    category: 'social',
    titleKey: 'event.session_law_004.title',
    bodyKey: 'event.session_law_004.body',
    isLaw: true,
    weight: 0,
    choices: [
      {
        id: 'session_law_004_pass',
        textKey: 'event.session_law_004.choice_a',
        effects: { lawsPassedDelta: 1, stabilityDelta: 6 },
      },
      {
        id: 'session_law_004_fail',
        textKey: 'event.session_law_004.choice_b',
        effects: { popularityDelta: -10, stabilityDelta: -5 },
      },
      {
        id: 'session_law_004_decree',
        textKey: 'event.session_law_004.choice_c',
        effects: { lawsPassedDelta: 1, stabilityDelta: 4, popularityDelta: -8, emergencyDecreeDelta: 1 },
      },
    ],
  },
  {
    id: 'session_law_005',
    category: 'political',
    titleKey: 'event.session_law_005.title',
    bodyKey: 'event.session_law_005.body',
    isLaw: true,
    weight: 0,
    choices: [
      {
        id: 'session_law_005_pass',
        textKey: 'event.session_law_005.choice_a',
        // DNU Ratification: auto-pass path only via decree option; normal vote is risky
        effects: { lawsPassedDelta: 1, emergencyDecreeDelta: 2, stabilityDelta: -5 },
      },
      {
        id: 'session_law_005_fail',
        textKey: 'event.session_law_005.choice_b',
        effects: { stabilityDelta: -8, mediaCredibilityDelta: -6 },
      },
      {
        id: 'session_law_005_decree',
        textKey: 'event.session_law_005.choice_c',
        effects: { lawsPassedDelta: 1, emergencyDecreeDelta: 2, stabilityDelta: -5 },
      },
    ],
  },
];

export const LAW_CARDS: EventCard[] = [...BASE_LAW_CARDS, ...SESSION_LAW_CARDS];
