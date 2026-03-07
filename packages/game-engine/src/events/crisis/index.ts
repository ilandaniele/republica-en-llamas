import type { EventCard } from '../../types.js';

export const CRISIS_CARDS: EventCard[] = [
  // ─── Debt Crisis cards ────────────────────────────────────────────────────
  {
    id: 'cri_debt_001',
    category: 'crisis',
    titleKey: 'event.cri_debt_001.title',
    bodyKey: 'event.cri_debt_001.body',
    weight: 10,
    requiredCrisis: 'debtCrisis',
    choices: [
      {
        id: 'cri_debt_001_a',
        textKey: 'event.cri_debt_001.choice_a',
        effects: { deficitDelta: -20, popularityDelta: -15, marketConfidenceDelta: 20 },
      },
      {
        id: 'cri_debt_001_b',
        textKey: 'event.cri_debt_001.choice_b',
        effects: { deficitDelta: 10, popularityDelta: 5, marketConfidenceDelta: -15 },
      },
      {
        id: 'cri_debt_001_c',
        textKey: 'event.cri_debt_001.choice_c',
        effects: { deficitDelta: -10, popularityDelta: -8, marketConfidenceDelta: 12 },
      },
      {
        id: 'cri_debt_001_d',
        textKey: 'event.cri_debt_001.choice_d',
        effects: { deficitDelta: -15, popularityDelta: -12, marketConfidenceDelta: 18, foreignReservesDelta: 10 },
      },
    ],
  },
  {
    id: 'cri_debt_002',
    category: 'crisis',
    titleKey: 'event.cri_debt_002.title',
    bodyKey: 'event.cri_debt_002.body',
    weight: 8,
    requiredCrisis: 'debtCrisis',
    choices: [
      {
        id: 'cri_debt_002_a',
        textKey: 'event.cri_debt_002.choice_a',
        effects: { foreignReservesDelta: 20, deficitDelta: 8, popularityDelta: -8 },
      },
      {
        id: 'cri_debt_002_b',
        textKey: 'event.cri_debt_002.choice_b',
        effects: { deficitDelta: -15, stabilityDelta: -10, popularityDelta: -10 },
      },
      {
        id: 'cri_debt_002_c',
        textKey: 'event.cri_debt_002.choice_c',
        effects: { foreignReservesDelta: 12, deficitDelta: 4, marketConfidenceDelta: -3, popularityDelta: -5 },
      },
      {
        id: 'cri_debt_002_d',
        textKey: 'event.cri_debt_002.choice_d',
        effects: { deficitDelta: -8, stabilityDelta: -5, popularityDelta: -5, marketConfidenceDelta: 5 },
      },
    ],
  },
  {
    id: 'cri_debt_003',
    category: 'crisis',
    titleKey: 'event.cri_debt_003.title',
    bodyKey: 'event.cri_debt_003.body',
    weight: 7,
    requiredCrisis: 'debtCrisis',
    choices: [
      {
        id: 'cri_debt_003_a',
        textKey: 'event.cri_debt_003.choice_a',
        effects: { marketConfidenceDelta: 25, deficitDelta: -12, currencyStrengthDelta: 10 },
      },
      {
        id: 'cri_debt_003_b',
        textKey: 'event.cri_debt_003.choice_b',
        effects: { popularityDelta: 10, deficitDelta: 5, stabilityDelta: 8 },
      },
      {
        id: 'cri_debt_003_c',
        textKey: 'event.cri_debt_003.choice_c',
        effects: { marketConfidenceDelta: 12, deficitDelta: -8, popularityDelta: -12 },
      },
      {
        id: 'cri_debt_003_d',
        textKey: 'event.cri_debt_003.choice_d',
        effects: { marketConfidenceDelta: -10, deficitDelta: -5, popularityDelta: 5 },
      },
    ],
  },
  // ─── Hyperinflation Spiral cards ─────────────────────────────────────────
  {
    id: 'cri_hyper_001',
    category: 'crisis',
    titleKey: 'event.cri_hyper_001.title',
    bodyKey: 'event.cri_hyper_001.body',
    weight: 10,
    requiredCrisis: 'hyperinflationSpiral',
    choices: [
      {
        id: 'cri_hyper_001_a',
        textKey: 'event.cri_hyper_001.choice_a',
        effects: { inflationDelta: -20, popularityDelta: -20, marketConfidenceDelta: 15 },
      },
      {
        id: 'cri_hyper_001_b',
        textKey: 'event.cri_hyper_001.choice_b',
        effects: { inflationDelta: 10, popularityDelta: 5, currencyStrengthDelta: -10 },
      },
      {
        id: 'cri_hyper_001_c',
        textKey: 'event.cri_hyper_001.choice_c',
        effects: { inflationDelta: -15, currencyStrengthDelta: 20, popularityDelta: -15, marketConfidenceDelta: 10 },
      },
      {
        id: 'cri_hyper_001_d',
        textKey: 'event.cri_hyper_001.choice_d',
        effects: { inflationDelta: -5, popularityDelta: 10, marketConfidenceDelta: -10 },
      },
    ],
  },
  {
    id: 'cri_hyper_002',
    category: 'crisis',
    titleKey: 'event.cri_hyper_002.title',
    bodyKey: 'event.cri_hyper_002.body',
    weight: 8,
    requiredCrisis: 'hyperinflationSpiral',
    choices: [
      {
        id: 'cri_hyper_002_a',
        textKey: 'event.cri_hyper_002.choice_a',
        effects: { currencyStrengthDelta: 20, inflationDelta: -15, deficitDelta: 8 },
      },
      {
        id: 'cri_hyper_002_b',
        textKey: 'event.cri_hyper_002.choice_b',
        effects: { popularityDelta: 8, inflationDelta: 5, stabilityDelta: 3 },
      },
      {
        id: 'cri_hyper_002_c',
        textKey: 'event.cri_hyper_002.choice_c',
        effects: { currencyStrengthDelta: 10, inflationDelta: -8, popularityDelta: -5, deficitDelta: 3 },
      },
      {
        id: 'cri_hyper_002_d',
        textKey: 'event.cri_hyper_002.choice_d',
        effects: { currencyStrengthDelta: 15, inflationDelta: -10, marketConfidenceDelta: -5, foreignReservesDelta: -10 },
      },
    ],
  },
  {
    id: 'cri_hyper_003',
    category: 'crisis',
    titleKey: 'event.cri_hyper_003.title',
    bodyKey: 'event.cri_hyper_003.body',
    weight: 7,
    requiredCrisis: 'hyperinflationSpiral',
    choices: [
      {
        id: 'cri_hyper_003_a',
        textKey: 'event.cri_hyper_003.choice_a',
        effects: { inflationDelta: -25, deficitDelta: -10, popularityDelta: -18 },
      },
      {
        id: 'cri_hyper_003_b',
        textKey: 'event.cri_hyper_003.choice_b',
        effects: { foreignReservesDelta: 15, inflationDelta: -10, marketConfidenceDelta: 10 },
      },
      {
        id: 'cri_hyper_003_c',
        textKey: 'event.cri_hyper_003.choice_c',
        effects: { inflationDelta: -18, deficitDelta: -8, popularityDelta: -15, marketConfidenceDelta: 8 },
      },
      {
        id: 'cri_hyper_003_d',
        textKey: 'event.cri_hyper_003.choice_d',
        effects: { foreignReservesDelta: 8, inflationDelta: -12, marketConfidenceDelta: 5, popularityDelta: -10 },
      },
    ],
  },
  // ─── Social Unrest cards ──────────────────────────────────────────────────
  {
    id: 'cri_social_001',
    category: 'crisis',
    titleKey: 'event.cri_social_001.title',
    bodyKey: 'event.cri_social_001.body',
    weight: 10,
    requiredCrisis: 'socialUnrest',
    choices: [
      {
        id: 'cri_social_001_a',
        textKey: 'event.cri_social_001.choice_a',
        effects: { stabilityDelta: 20, popularityDelta: 10, deficitDelta: 10 },
      },
      {
        id: 'cri_social_001_b',
        textKey: 'event.cri_social_001.choice_b',
        effects: { stabilityDelta: -10, popularityDelta: -8, mediaCredibilityDelta: -8 },
      },
      {
        id: 'cri_social_001_c',
        textKey: 'event.cri_social_001.choice_c',
        effects: { stabilityDelta: 12, popularityDelta: 15, deficitDelta: 12, inflationDelta: 3 },
      },
      {
        id: 'cri_social_001_d',
        textKey: 'event.cri_social_001.choice_d',
        effects: { stabilityDelta: 8, popularityDelta: 5, mediaCredibilityDelta: 5 },
      },
    ],
  },
  {
    id: 'cri_social_002',
    category: 'crisis',
    titleKey: 'event.cri_social_002.title',
    bodyKey: 'event.cri_social_002.body',
    weight: 8,
    requiredCrisis: 'socialUnrest',
    choices: [
      {
        id: 'cri_social_002_a',
        textKey: 'event.cri_social_002.choice_a',
        effects: { popularityDelta: 15, stabilityDelta: 12, deficitDelta: 8 },
      },
      {
        id: 'cri_social_002_b',
        textKey: 'event.cri_social_002.choice_b',
        effects: { stabilityDelta: 5, mediaCredibilityDelta: 10, popularityDelta: -5 },
      },
      {
        id: 'cri_social_002_c',
        textKey: 'event.cri_social_002.choice_c',
        effects: { popularityDelta: 8, stabilityDelta: 8, mediaCredibilityDelta: 8 },
      },
      {
        id: 'cri_social_002_d',
        textKey: 'event.cri_social_002.choice_d',
        effects: { stabilityDelta: 10, popularityDelta: -5, mediaCredibilityDelta: -5 },
      },
    ],
  },
  {
    id: 'cri_social_003',
    category: 'crisis',
    titleKey: 'event.cri_social_003.title',
    bodyKey: 'event.cri_social_003.body',
    weight: 7,
    requiredCrisis: 'socialUnrest',
    choices: [
      {
        id: 'cri_social_003_a',
        textKey: 'event.cri_social_003.choice_a',
        effects: { stabilityDelta: 18, popularityDelta: 8, deficitDelta: 12 },
      },
      {
        id: 'cri_social_003_b',
        textKey: 'event.cri_social_003.choice_b',
        effects: { stabilityDelta: -5, marketConfidenceDelta: 10, popularityDelta: -8 },
      },
      {
        id: 'cri_social_003_c',
        textKey: 'event.cri_social_003.choice_c',
        effects: { stabilityDelta: 12, popularityDelta: 10, deficitDelta: 8 },
      },
      {
        id: 'cri_social_003_d',
        textKey: 'event.cri_social_003.choice_d',
        effects: { stabilityDelta: 8, popularityDelta: 5, mediaCredibilityDelta: 10 },
      },
    ],
  },
  // ─── Legislative Rebellion cards ──────────────────────────────────────────
  {
    id: 'cri_legis_001',
    category: 'crisis',
    titleKey: 'event.cri_legis_001.title',
    bodyKey: 'event.cri_legis_001.body',
    weight: 10,
    requiredCrisis: 'legislativeRebellion',
    choices: [
      {
        id: 'cri_legis_001_a',
        textKey: 'event.cri_legis_001.choice_a',
        effects: { governmentSeatsDelta: 30, popularityDelta: -10, deficitDelta: 8 },
      },
      {
        id: 'cri_legis_001_b',
        textKey: 'event.cri_legis_001.choice_b',
        effects: { stabilityDelta: 10, popularityDelta: 5, mediaCredibilityDelta: 8 },
      },
      {
        id: 'cri_legis_001_c',
        textKey: 'event.cri_legis_001.choice_c',
        effects: { governmentSeatsDelta: -5, popularityDelta: 5, stabilityDelta: -8 },
      },
      {
        id: 'cri_legis_001_d',
        textKey: 'event.cri_legis_001.choice_d',
        effects: { governmentSeatsDelta: 10, popularityDelta: 8, stabilityDelta: -5, deficitDelta: 3 },
      },
    ],
  },
  {
    id: 'cri_legis_002',
    category: 'crisis',
    titleKey: 'event.cri_legis_002.title',
    bodyKey: 'event.cri_legis_002.body',
    weight: 8,
    requiredCrisis: 'legislativeRebellion',
    choices: [
      {
        id: 'cri_legis_002_a',
        textKey: 'event.cri_legis_002.choice_a',
        effects: { governmentSeatsDelta: 20, popularityDelta: 5, stabilityDelta: 5 },
      },
      {
        id: 'cri_legis_002_b',
        textKey: 'event.cri_legis_002.choice_b',
        effects: { deficitDelta: -8, popularityDelta: 8, stabilityDelta: 8 },
      },
      {
        id: 'cri_legis_002_c',
        textKey: 'event.cri_legis_002.choice_c',
        effects: { governmentSeatsDelta: 12, popularityDelta: 3, stabilityDelta: 8 },
      },
      {
        id: 'cri_legis_002_d',
        textKey: 'event.cri_legis_002.choice_d',
        effects: { governmentSeatsDelta: -5, emergencyDecreeDelta: 2, popularityDelta: -8, stabilityDelta: -3 },
      },
    ],
  },
  {
    id: 'cri_legis_003',
    category: 'crisis',
    titleKey: 'event.cri_legis_003.title',
    bodyKey: 'event.cri_legis_003.body',
    weight: 7,
    requiredCrisis: 'legislativeRebellion',
    choices: [
      {
        id: 'cri_legis_003_a',
        textKey: 'event.cri_legis_003.choice_a',
        effects: { popularityDelta: 12, stabilityDelta: 15, governmentSeatsDelta: 15 },
      },
      {
        id: 'cri_legis_003_b',
        textKey: 'event.cri_legis_003.choice_b',
        effects: { emergencyDecreeDelta: 1, governmentSeatsDelta: 5, popularityDelta: -5 },
      },
      {
        id: 'cri_legis_003_c',
        textKey: 'event.cri_legis_003.choice_c',
        effects: { popularityDelta: 8, stabilityDelta: 10, governmentSeatsDelta: 20 },
      },
      {
        id: 'cri_legis_003_d',
        textKey: 'event.cri_legis_003.choice_d',
        effects: { popularityDelta: 5, stabilityDelta: 12, governmentSeatsDelta: 10, deficitDelta: 2 },
      },
    ],
  },
  // ─── Impeachment Attempt cards ────────────────────────────────────────────
  {
    id: 'cri_impeach_001',
    category: 'crisis',
    titleKey: 'event.cri_impeach_001.title',
    bodyKey: 'event.cri_impeach_001.body',
    weight: 10,
    requiredCrisis: 'impeachmentAttempt',
    choices: [
      {
        id: 'cri_impeach_001_a',
        textKey: 'event.cri_impeach_001.choice_a',
        effects: { popularityDelta: 20, mediaCredibilityDelta: 15, stabilityDelta: 10 },
      },
      {
        id: 'cri_impeach_001_b',
        textKey: 'event.cri_impeach_001.choice_b',
        effects: { popularityDelta: -10, stabilityDelta: -8, mediaCredibilityDelta: -10 },
      },
      {
        id: 'cri_impeach_001_c',
        textKey: 'event.cri_impeach_001.choice_c',
        effects: { popularityDelta: 15, mediaCredibilityDelta: 10, stabilityDelta: 5 },
      },
      {
        id: 'cri_impeach_001_d',
        textKey: 'event.cri_impeach_001.choice_d',
        effects: { popularityDelta: 12, mediaCredibilityDelta: 5, stabilityDelta: 3 },
      },
    ],
  },
  {
    id: 'cri_impeach_002',
    category: 'crisis',
    titleKey: 'event.cri_impeach_002.title',
    bodyKey: 'event.cri_impeach_002.body',
    weight: 8,
    requiredCrisis: 'impeachmentAttempt',
    choices: [
      {
        id: 'cri_impeach_002_a',
        textKey: 'event.cri_impeach_002.choice_a',
        effects: { mediaCredibilityDelta: 20, popularityDelta: 15, deficitDelta: 5 },
      },
      {
        id: 'cri_impeach_002_b',
        textKey: 'event.cri_impeach_002.choice_b',
        effects: { popularityDelta: 8, stabilityDelta: 5, mediaCredibilityDelta: 8 },
      },
      {
        id: 'cri_impeach_002_c',
        textKey: 'event.cri_impeach_002.choice_c',
        effects: { mediaCredibilityDelta: 12, popularityDelta: 10, governmentSeatsDelta: 5 },
      },
      {
        id: 'cri_impeach_002_d',
        textKey: 'event.cri_impeach_002.choice_d',
        effects: { popularityDelta: 20, stabilityDelta: 3, deficitDelta: 2 },
      },
    ],
  },
  {
    id: 'cri_impeach_003',
    category: 'crisis',
    titleKey: 'event.cri_impeach_003.title',
    bodyKey: 'event.cri_impeach_003.body',
    weight: 7,
    requiredCrisis: 'impeachmentAttempt',
    choices: [
      {
        id: 'cri_impeach_003_a',
        textKey: 'event.cri_impeach_003.choice_a',
        effects: { popularityDelta: 25, stabilityDelta: 12, mediaCredibilityDelta: 18 },
      },
      {
        id: 'cri_impeach_003_b',
        textKey: 'event.cri_impeach_003.choice_b',
        effects: { popularityDelta: -15, stabilityDelta: -10, mediaCredibilityDelta: -15 },
      },
      {
        id: 'cri_impeach_003_c',
        textKey: 'event.cri_impeach_003.choice_c',
        effects: { popularityDelta: 18, stabilityDelta: 8, mediaCredibilityDelta: 10 },
      },
      {
        id: 'cri_impeach_003_d',
        textKey: 'event.cri_impeach_003.choice_d',
        effects: { popularityDelta: 10, stabilityDelta: 15, governmentSeatsDelta: 8 },
      },
    ],
  },
];
