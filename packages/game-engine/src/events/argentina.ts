import type { EventCard } from '../types.js';

export const ARGENTINA_CARDS: EventCard[] = [
  // 1 — Rodrigazo v2
  {
    id: 'arg_001',
    category: 'economic',
    titleKey: 'event.arg_001.title',
    bodyKey: 'event.arg_001.body',
    weight: 7,
    minDifficulty: 'normal',
    choices: [
      {
        id: 'arg_001_a',
        textKey: 'event.arg_001.choice_a',
        effects: { popularityDelta: -15, stabilityDelta: -8, inflationDelta: -10, deficitDelta: 5 },
      },
      {
        id: 'arg_001_b',
        textKey: 'event.arg_001.choice_b',
        effects: { popularityDelta: -8, inflationDelta: 5, marketConfidenceDelta: 10 },
      },
      {
        id: 'arg_001_c',
        textKey: 'event.arg_001.choice_c',
        effects: { popularityDelta: -20, inflationDelta: -15, stabilityDelta: -15 },
      },
      {
        id: 'arg_001_d',
        textKey: 'event.arg_001.choice_d',
        effects: { popularityDelta: -10, inflationDelta: -5, marketConfidenceDelta: -8, stabilityDelta: -5 },
      },
    ],
  },
  // 2 — Corralito 2
  {
    id: 'arg_002',
    category: 'economic',
    titleKey: 'event.arg_002.title',
    bodyKey: 'event.arg_002.body',
    weight: 6,
    minDifficulty: 'normal',
    choices: [
      {
        id: 'arg_002_a',
        textKey: 'event.arg_002.choice_a',
        effects: { popularityDelta: -20, stabilityDelta: -12, marketConfidenceDelta: 5, foreignReservesDelta: 10 },
      },
      {
        id: 'arg_002_b',
        textKey: 'event.arg_002.choice_b',
        effects: { marketConfidenceDelta: -20, foreignReservesDelta: -15, popularityDelta: 5 },
      },
      {
        id: 'arg_002_c',
        textKey: 'event.arg_002.choice_c',
        effects: { popularityDelta: -10, marketConfidenceDelta: -5, foreignReservesDelta: 5, stabilityDelta: 3 },
      },
      {
        id: 'arg_002_d',
        textKey: 'event.arg_002.choice_d',
        effects: { popularityDelta: -5, stabilityDelta: -3, mediaCredibilityDelta: 5 },
      },
    ],
  },
  // 3 — Campo no siembra
  {
    id: 'arg_003',
    category: 'economic',
    titleKey: 'event.arg_003.title',
    bodyKey: 'event.arg_003.body',
    weight: 7,
    minDifficulty: 'normal',
    choices: [
      {
        id: 'arg_003_a',
        textKey: 'event.arg_003.choice_a',
        effects: { popularityDelta: -5, marketConfidenceDelta: 10, foreignReservesDelta: 8, stabilityDelta: -8 },
      },
      {
        id: 'arg_003_b',
        textKey: 'event.arg_003.choice_b',
        effects: { popularityDelta: 12, stabilityDelta: 5, marketConfidenceDelta: -15, foreignReservesDelta: -10 },
      },
      {
        id: 'arg_003_c',
        textKey: 'event.arg_003.choice_c',
        effects: { popularityDelta: -3, marketConfidenceDelta: 5, foreignReservesDelta: 5, stabilityDelta: -3 },
      },
      {
        id: 'arg_003_d',
        textKey: 'event.arg_003.choice_d',
        effects: { popularityDelta: 5, stabilityDelta: 3, marketConfidenceDelta: -8 },
      },
    ],
  },
  // 4 — La Grieta
  {
    id: 'arg_004',
    category: 'political',
    titleKey: 'event.arg_004.title',
    bodyKey: 'event.arg_004.body',
    weight: 8,
    minDifficulty: 'normal',
    choices: [
      {
        id: 'arg_004_a',
        textKey: 'event.arg_004.choice_a',
        effects: { popularityDelta: -5, stabilityDelta: -10, mediaCredibilityDelta: 5 },
      },
      {
        id: 'arg_004_b',
        textKey: 'event.arg_004.choice_b',
        effects: { popularityDelta: -8, stabilityDelta: -8, mediaCredibilityDelta: -5 },
      },
      {
        id: 'arg_004_c',
        textKey: 'event.arg_004.choice_c',
        effects: { popularityDelta: 5, stabilityDelta: 5, mediaCredibilityDelta: -10 },
      },
      {
        id: 'arg_004_d',
        textKey: 'event.arg_004.choice_d',
        effects: { popularityDelta: 3, stabilityDelta: 8, mediaCredibilityDelta: 5 },
      },
    ],
  },
  // 5 — Dólar blue
  {
    id: 'arg_005',
    category: 'economic',
    titleKey: 'event.arg_005.title',
    bodyKey: 'event.arg_005.body',
    weight: 8,
    minDifficulty: 'normal',
    choices: [
      {
        id: 'arg_005_a',
        textKey: 'event.arg_005.choice_a',
        effects: { marketConfidenceDelta: -15, currencyStrengthDelta: -10, inflationDelta: 8 },
      },
      {
        id: 'arg_005_b',
        textKey: 'event.arg_005.choice_b',
        effects: { foreignReservesDelta: -20, currencyStrengthDelta: 10, marketConfidenceDelta: 8 },
      },
      {
        id: 'arg_005_c',
        textKey: 'event.arg_005.choice_c',
        effects: { popularityDelta: -10, marketConfidenceDelta: 5, currencyStrengthDelta: 5, inflationDelta: -5 },
      },
      {
        id: 'arg_005_d',
        textKey: 'event.arg_005.choice_d',
        effects: { currencyStrengthDelta: 3, marketConfidenceDelta: 5, inflationDelta: 5, popularityDelta: -5 },
      },
    ],
  },
  // 6 — Pacto Olivos 2
  {
    id: 'arg_006',
    category: 'political',
    titleKey: 'event.arg_006.title',
    bodyKey: 'event.arg_006.body',
    weight: 6,
    minTurn: 10,
    minDifficulty: 'normal',
    choices: [
      {
        id: 'arg_006_a',
        textKey: 'event.arg_006.choice_a',
        effects: { governmentSeatsDelta: 20, popularityDelta: -10, stabilityDelta: 5 },
      },
      {
        id: 'arg_006_b',
        textKey: 'event.arg_006.choice_b',
        effects: { popularityDelta: 8, mediaCredibilityDelta: 10, stabilityDelta: -5 },
      },
      {
        id: 'arg_006_c',
        textKey: 'event.arg_006.choice_c',
        effects: { governmentSeatsDelta: 8, popularityDelta: -3, stabilityDelta: 3 },
      },
      {
        id: 'arg_006_d',
        textKey: 'event.arg_006.choice_d',
        effects: { governmentSeatsDelta: 5, popularityDelta: 3, stabilityDelta: 5 },
      },
    ],
  },
  // 7 — FMI última oportunidad
  {
    id: 'arg_007',
    category: 'economic',
    titleKey: 'event.arg_007.title',
    bodyKey: 'event.arg_007.body',
    weight: 7,
    minDifficulty: 'normal',
    choices: [
      {
        id: 'arg_007_a',
        textKey: 'event.arg_007.choice_a',
        effects: { foreignReservesDelta: 25, marketConfidenceDelta: 15, popularityDelta: -18, deficitDelta: -10 },
      },
      {
        id: 'arg_007_b',
        textKey: 'event.arg_007.choice_b',
        effects: { foreignReservesDelta: -25, marketConfidenceDelta: -25, popularityDelta: 10, inflationDelta: 15 },
      },
      {
        id: 'arg_007_c',
        textKey: 'event.arg_007.choice_c',
        effects: { foreignReservesDelta: 12, marketConfidenceDelta: 8, popularityDelta: -8, deficitDelta: -5 },
      },
      {
        id: 'arg_007_d',
        textKey: 'event.arg_007.choice_d',
        effects: { foreignReservesDelta: 10, marketConfidenceDelta: 5, popularityDelta: -5, deficitDelta: -3 },
      },
    ],
  },
  // 8 — Piquetes 9 de Julio
  {
    id: 'arg_008',
    category: 'social',
    titleKey: 'event.arg_008.title',
    bodyKey: 'event.arg_008.body',
    weight: 8,
    minDifficulty: 'normal',
    choices: [
      {
        id: 'arg_008_a',
        textKey: 'event.arg_008.choice_a',
        effects: { popularityDelta: -5, stabilityDelta: 8, deficitDelta: 5 },
      },
      {
        id: 'arg_008_b',
        textKey: 'event.arg_008.choice_b',
        effects: { popularityDelta: -15, stabilityDelta: -10, mediaCredibilityDelta: -8 },
      },
      {
        id: 'arg_008_c',
        textKey: 'event.arg_008.choice_c',
        effects: { popularityDelta: 2, stabilityDelta: 5, deficitDelta: 4 },
      },
      {
        id: 'arg_008_d',
        textKey: 'event.arg_008.choice_d',
        effects: { popularityDelta: -2, stabilityDelta: 6, mediaCredibilityDelta: 3 },
      },
    ],
  },
  // 9 — Juicio político
  {
    id: 'arg_009',
    category: 'political',
    titleKey: 'event.arg_009.title',
    bodyKey: 'event.arg_009.body',
    weight: 5,
    minTurn: 15,
    minDifficulty: 'hard',
    choices: [
      {
        id: 'arg_009_a',
        textKey: 'event.arg_009.choice_a',
        effects: { mediaCredibilityDelta: 15, stabilityDelta: 5, popularityDelta: -5 },
      },
      {
        id: 'arg_009_b',
        textKey: 'event.arg_009.choice_b',
        effects: { popularityDelta: -20, stabilityDelta: -15, governmentSeatsDelta: -30 },
      },
      {
        id: 'arg_009_c',
        textKey: 'event.arg_009.choice_c',
        effects: { popularityDelta: -8, mediaCredibilityDelta: 5, stabilityDelta: 3 },
      },
      {
        id: 'arg_009_d',
        textKey: 'event.arg_009.choice_d',
        effects: { popularityDelta: -3, mediaCredibilityDelta: -5, stabilityDelta: -2 },
      },
    ],
  },
  // 10 — Elecciones de medio término
  {
    id: 'arg_010',
    category: 'political',
    titleKey: 'event.arg_010.title',
    bodyKey: 'event.arg_010.body',
    weight: 7,
    minTurn: 20,
    maxTurn: 35,
    choices: [
      {
        id: 'arg_010_a',
        textKey: 'event.arg_010.choice_a',
        effects: { governmentSeatsDelta: -20, popularityDelta: 3, deficitDelta: 8 },
      },
      {
        id: 'arg_010_b',
        textKey: 'event.arg_010.choice_b',
        effects: { governmentSeatsDelta: -25, popularityDelta: -10, deficitDelta: -3 },
      },
      {
        id: 'arg_010_c',
        textKey: 'event.arg_010.choice_c',
        effects: { governmentSeatsDelta: -15, deficitDelta: 5, popularityDelta: 5 },
      },
      {
        id: 'arg_010_d',
        textKey: 'event.arg_010.choice_d',
        effects: { governmentSeatsDelta: -10, popularityDelta: 3, stabilityDelta: 3 },
      },
    ],
  },
  // 11 — Plan Bonex
  {
    id: 'arg_011',
    category: 'economic',
    titleKey: 'event.arg_011.title',
    bodyKey: 'event.arg_011.body',
    weight: 4,
    minDifficulty: 'hard',
    choices: [
      {
        id: 'arg_011_a',
        textKey: 'event.arg_011.choice_a',
        effects: { inflationDelta: -20, popularityDelta: -25, stabilityDelta: -15, deficitDelta: -15 },
      },
      {
        id: 'arg_011_b',
        textKey: 'event.arg_011.choice_b',
        effects: { inflationDelta: 15, deficitDelta: 10, popularityDelta: 5 },
      },
      {
        id: 'arg_011_c',
        textKey: 'event.arg_011.choice_c',
        effects: { inflationDelta: -12, popularityDelta: -18, stabilityDelta: -10, deficitDelta: -10 },
      },
      {
        id: 'arg_011_d',
        textKey: 'event.arg_011.choice_d',
        effects: { inflationDelta: -8, popularityDelta: -10, deficitDelta: -5, marketConfidenceDelta: 5 },
      },
    ],
  },
  // 12 — Visita del Papa
  {
    id: 'arg_012',
    category: 'social',
    titleKey: 'event.arg_012.title',
    bodyKey: 'event.arg_012.body',
    weight: 5,
    choices: [
      {
        id: 'arg_012_a',
        textKey: 'event.arg_012.choice_a',
        effects: { popularityDelta: 15, stabilityDelta: 8, mediaCredibilityDelta: 10 },
      },
      {
        id: 'arg_012_b',
        textKey: 'event.arg_012.choice_b',
        effects: { popularityDelta: 5, mediaCredibilityDelta: -5 },
      },
      {
        id: 'arg_012_c',
        textKey: 'event.arg_012.choice_c',
        effects: { popularityDelta: 12, stabilityDelta: 6, mediaCredibilityDelta: 5 },
      },
      {
        id: 'arg_012_d',
        textKey: 'event.arg_012.choice_d',
        effects: { popularityDelta: 8, stabilityDelta: 5, mediaCredibilityDelta: 6 },
      },
    ],
  },
  // 13 — La Tablita
  {
    id: 'arg_013',
    category: 'economic',
    titleKey: 'event.arg_013.title',
    bodyKey: 'event.arg_013.body',
    weight: 5,
    minDifficulty: 'normal',
    choices: [
      {
        id: 'arg_013_a',
        textKey: 'event.arg_013.choice_a',
        effects: { inflationDelta: -15, currencyStrengthDelta: 15, foreignReservesDelta: -20, marketConfidenceDelta: 10 },
      },
      {
        id: 'arg_013_b',
        textKey: 'event.arg_013.choice_b',
        effects: { inflationDelta: 10, currencyStrengthDelta: -5, popularityDelta: 5 },
      },
      {
        id: 'arg_013_c',
        textKey: 'event.arg_013.choice_c',
        effects: { inflationDelta: -10, currencyStrengthDelta: 8, foreignReservesDelta: -12, marketConfidenceDelta: 5 },
      },
      {
        id: 'arg_013_d',
        textKey: 'event.arg_013.choice_d',
        effects: { inflationDelta: -8, currencyStrengthDelta: 10, foreignReservesDelta: -8, marketConfidenceDelta: 8 },
      },
    ],
  },
  // 14 — Helicóptero presidencial
  {
    id: 'arg_014',
    category: 'political',
    titleKey: 'event.arg_014.title',
    bodyKey: 'event.arg_014.body',
    weight: 3,
    minTurn: 25,
    minDifficulty: 'hard',
    choices: [
      {
        id: 'arg_014_a',
        textKey: 'event.arg_014.choice_a',
        effects: { popularityDelta: -25, stabilityDelta: -20, mediaCredibilityDelta: -20 },
      },
      {
        id: 'arg_014_b',
        textKey: 'event.arg_014.choice_b',
        effects: { popularityDelta: -10, stabilityDelta: -8, mediaCredibilityDelta: 5 },
      },
      {
        id: 'arg_014_c',
        textKey: 'event.arg_014.choice_c',
        effects: { popularityDelta: -15, stabilityDelta: -10, mediaCredibilityDelta: -8 },
      },
      {
        id: 'arg_014_d',
        textKey: 'event.arg_014.choice_d',
        effects: { popularityDelta: -8, stabilityDelta: -5, mediaCredibilityDelta: 8 },
      },
    ],
  },
  // 15 — Argentina Campeón
  {
    id: 'arg_015',
    category: 'social',
    titleKey: 'event.arg_015.title',
    bodyKey: 'event.arg_015.body',
    weight: 4,
    choices: [
      {
        id: 'arg_015_a',
        textKey: 'event.arg_015.choice_a',
        effects: { popularityDelta: 20, stabilityDelta: 15, mediaCredibilityDelta: 10 },
      },
      {
        id: 'arg_015_b',
        textKey: 'event.arg_015.choice_b',
        effects: { popularityDelta: 12, stabilityDelta: 8, deficitDelta: 5 },
      },
      {
        id: 'arg_015_c',
        textKey: 'event.arg_015.choice_c',
        effects: { popularityDelta: 18, stabilityDelta: 12, deficitDelta: 3 },
      },
      {
        id: 'arg_015_d',
        textKey: 'event.arg_015.choice_d',
        effects: { popularityDelta: 10, stabilityDelta: 6, deficitDelta: 2, gdpGrowthDelta: 0.3 },
      },
    ],
  },

  // ─── Historical Scenario Cards ─────────────────────────────────────────────
  // Each set of 3: real decision + counterfactual + consequence
  // requiredFlags: ['scenario_<id>'] restricts them to the matching scenario

  // ── Hiperinflación 1989 ───────────────────────────────────────────────────
  {
    id: 'hist_hiper_001',
    category: 'economic',
    titleKey: 'event.hist_hiper_001.title',
    bodyKey: 'event.hist_hiper_001.body',
    weight: 10,
    minTurn: 1,
    maxTurn: 5,
    requiredFlags: ['scenario_hiperinflacion_1989'],
    choices: [
      { id: 'hist_hiper_001_a', textKey: 'event.hist_hiper_001.choice_a', effects: { popularityDelta: -30, inflationDelta: 20, stabilityDelta: -20 } },
      { id: 'hist_hiper_001_b', textKey: 'event.hist_hiper_001.choice_b', effects: { popularityDelta: -10, inflationDelta: 40, marketConfidenceDelta: -20 } },
      { id: 'hist_hiper_001_c', textKey: 'event.hist_hiper_001.choice_c', effects: { popularityDelta: -20, inflationDelta: -15, deficitDelta: 15, marketConfidenceDelta: 10 } },
      { id: 'hist_hiper_001_d', textKey: 'event.hist_hiper_001.choice_d', effects: { popularityDelta: -5, inflationDelta: 10, deficitDelta: 5, stabilityDelta: -10 } },
    ],
  },
  {
    id: 'hist_hiper_002',
    category: 'political',
    titleKey: 'event.hist_hiper_002.title',
    bodyKey: 'event.hist_hiper_002.body',
    weight: 9,
    minTurn: 3,
    maxTurn: 10,
    requiredFlags: ['scenario_hiperinflacion_1989'],
    choices: [
      { id: 'hist_hiper_002_a', textKey: 'event.hist_hiper_002.choice_a', effects: { popularityDelta: -40, inflationDelta: -30, marketConfidenceDelta: 20, deficitDelta: -10 } },
      { id: 'hist_hiper_002_b', textKey: 'event.hist_hiper_002.choice_b', effects: { popularityDelta: 15, inflationDelta: 25, marketConfidenceDelta: -25 } },
      { id: 'hist_hiper_002_c', textKey: 'event.hist_hiper_002.choice_c', effects: { popularityDelta: -5, inflationDelta: -10, deficitDelta: 5 } },
    ],
  },
  {
    id: 'hist_hiper_003',
    category: 'economic',
    titleKey: 'event.hist_hiper_003.title',
    bodyKey: 'event.hist_hiper_003.body',
    weight: 8,
    minTurn: 6,
    requiredFlags: ['scenario_hiperinflacion_1989'],
    choices: [
      { id: 'hist_hiper_003_a', textKey: 'event.hist_hiper_003.choice_a', effects: { popularityDelta: -20, inflationDelta: -40, marketConfidenceDelta: 30, deficitDelta: 20 } },
      { id: 'hist_hiper_003_b', textKey: 'event.hist_hiper_003.choice_b', effects: { popularityDelta: 10, inflationDelta: 15, stabilityDelta: -15 } },
      { id: 'hist_hiper_003_c', textKey: 'event.hist_hiper_003.choice_c', effects: { popularityDelta: -10, inflationDelta: -20, marketConfidenceDelta: 15 } },
    ],
  },

  // ── El Corralito 2001 ─────────────────────────────────────────────────────
  {
    id: 'hist_corral_001',
    category: 'economic',
    titleKey: 'event.hist_corral_001.title',
    bodyKey: 'event.hist_corral_001.body',
    weight: 10,
    minTurn: 1,
    maxTurn: 5,
    requiredFlags: ['scenario_corralito_2001'],
    choices: [
      { id: 'hist_corral_001_a', textKey: 'event.hist_corral_001.choice_a', effects: { popularityDelta: -25, marketConfidenceDelta: -20, foreignReservesDelta: -30 } },
      { id: 'hist_corral_001_b', textKey: 'event.hist_corral_001.choice_b', effects: { popularityDelta: -30, stabilityDelta: -20, marketConfidenceDelta: 5 } },
      { id: 'hist_corral_001_c', textKey: 'event.hist_corral_001.choice_c', effects: { popularityDelta: -10, deficitDelta: 15, marketConfidenceDelta: -10 } },
      { id: 'hist_corral_001_d', textKey: 'event.hist_corral_001.choice_d', effects: { popularityDelta: -5, marketConfidenceDelta: -5, stabilityDelta: -5, mediaCredibilityDelta: 5 } },
    ],
  },
  {
    id: 'hist_corral_002',
    category: 'political',
    titleKey: 'event.hist_corral_002.title',
    bodyKey: 'event.hist_corral_002.body',
    weight: 9,
    minTurn: 3,
    requiredFlags: ['scenario_corralito_2001'],
    choices: [
      { id: 'hist_corral_002_a', textKey: 'event.hist_corral_002.choice_a', effects: { popularityDelta: -40, stabilityDelta: -30 } },
      { id: 'hist_corral_002_b', textKey: 'event.hist_corral_002.choice_b', effects: { popularityDelta: -15, deficitDelta: 20, marketConfidenceDelta: -15 } },
      { id: 'hist_corral_002_c', textKey: 'event.hist_corral_002.choice_c', effects: { popularityDelta: -10, marketConfidenceDelta: -10, inflationDelta: 10 } },
    ],
  },
  {
    id: 'hist_corral_003',
    category: 'economic',
    titleKey: 'event.hist_corral_003.title',
    bodyKey: 'event.hist_corral_003.body',
    weight: 8,
    minTurn: 5,
    requiredFlags: ['scenario_corralito_2001'],
    choices: [
      { id: 'hist_corral_003_a', textKey: 'event.hist_corral_003.choice_a', effects: { popularityDelta: -35, inflationDelta: 30, marketConfidenceDelta: -20, foreignReservesDelta: -20 } },
      { id: 'hist_corral_003_b', textKey: 'event.hist_corral_003.choice_b', effects: { popularityDelta: -20, deficitDelta: 25, foreignReservesDelta: 10 } },
      { id: 'hist_corral_003_c', textKey: 'event.hist_corral_003.choice_c', effects: { popularityDelta: -10, inflationDelta: 15, foreignReservesDelta: -10 } },
    ],
  },

  // ── La Convertibilidad ────────────────────────────────────────────────────
  {
    id: 'hist_conv_001',
    category: 'economic',
    titleKey: 'event.hist_conv_001.title',
    bodyKey: 'event.hist_conv_001.body',
    weight: 10,
    minTurn: 1,
    maxTurn: 5,
    requiredFlags: ['scenario_convertibilidad'],
    choices: [
      { id: 'hist_conv_001_a', textKey: 'event.hist_conv_001.choice_a', effects: { popularityDelta: 10, marketConfidenceDelta: 15, inflationDelta: -10, deficitDelta: 5 } },
      { id: 'hist_conv_001_b', textKey: 'event.hist_conv_001.choice_b', effects: { popularityDelta: -5, marketConfidenceDelta: -20, inflationDelta: 5 } },
      { id: 'hist_conv_001_c', textKey: 'event.hist_conv_001.choice_c', effects: { popularityDelta: 5, deficitDelta: 10, foreignReservesDelta: -8 } },
    ],
  },
  {
    id: 'hist_conv_002',
    category: 'economic',
    titleKey: 'event.hist_conv_002.title',
    bodyKey: 'event.hist_conv_002.body',
    weight: 9,
    minTurn: 4,
    requiredFlags: ['scenario_convertibilidad'],
    choices: [
      { id: 'hist_conv_002_a', textKey: 'event.hist_conv_002.choice_a', effects: { popularityDelta: -10, foreignReservesDelta: -20, marketConfidenceDelta: 10 } },
      { id: 'hist_conv_002_b', textKey: 'event.hist_conv_002.choice_b', effects: { popularityDelta: -20, marketConfidenceDelta: -15, inflationDelta: 8 } },
      { id: 'hist_conv_002_c', textKey: 'event.hist_conv_002.choice_c', effects: { popularityDelta: -5, deficitDelta: 8, foreignReservesDelta: -5 } },
    ],
  },
  {
    id: 'hist_conv_003',
    category: 'economic',
    titleKey: 'event.hist_conv_003.title',
    bodyKey: 'event.hist_conv_003.body',
    weight: 8,
    minTurn: 8,
    requiredFlags: ['scenario_convertibilidad'],
    choices: [
      { id: 'hist_conv_003_a', textKey: 'event.hist_conv_003.choice_a', effects: { popularityDelta: -30, inflationDelta: 20, marketConfidenceDelta: -25, foreignReservesDelta: 15 } },
      { id: 'hist_conv_003_b', textKey: 'event.hist_conv_003.choice_b', effects: { popularityDelta: 5, foreignReservesDelta: -25, deficitDelta: 15 } },
      { id: 'hist_conv_003_c', textKey: 'event.hist_conv_003.choice_c', effects: { popularityDelta: -15, inflationDelta: 10, foreignReservesDelta: -10, marketConfidenceDelta: -10 } },
    ],
  },

  // ── El Rodrigazo 1975 ─────────────────────────────────────────────────────
  {
    id: 'hist_rod_001',
    category: 'economic',
    titleKey: 'event.hist_rod_001.title',
    bodyKey: 'event.hist_rod_001.body',
    weight: 10,
    minTurn: 1,
    maxTurn: 4,
    requiredFlags: ['scenario_rodrigazo_1975'],
    choices: [
      { id: 'hist_rod_001_a', textKey: 'event.hist_rod_001.choice_a', effects: { popularityDelta: -25, inflationDelta: 35, stabilityDelta: -25, marketConfidenceDelta: 10 } },
      { id: 'hist_rod_001_b', textKey: 'event.hist_rod_001.choice_b', effects: { popularityDelta: 10, deficitDelta: 20, inflationDelta: 10 } },
      { id: 'hist_rod_001_c', textKey: 'event.hist_rod_001.choice_c', effects: { popularityDelta: -15, inflationDelta: 15, stabilityDelta: -10, deficitDelta: 10 } },
    ],
  },
  {
    id: 'hist_rod_002',
    category: 'political',
    titleKey: 'event.hist_rod_002.title',
    bodyKey: 'event.hist_rod_002.body',
    weight: 9,
    minTurn: 2,
    requiredFlags: ['scenario_rodrigazo_1975'],
    choices: [
      { id: 'hist_rod_002_a', textKey: 'event.hist_rod_002.choice_a', effects: { popularityDelta: -20, stabilityDelta: -15, inflationDelta: -10, deficitDelta: 5 } },
      { id: 'hist_rod_002_b', textKey: 'event.hist_rod_002.choice_b', effects: { popularityDelta: 15, stabilityDelta: 10, inflationDelta: 15, deficitDelta: 15 } },
      { id: 'hist_rod_002_c', textKey: 'event.hist_rod_002.choice_c', effects: { popularityDelta: -8, inflationDelta: 5, deficitDelta: 8 } },
    ],
  },
  {
    id: 'hist_rod_003',
    category: 'political',
    titleKey: 'event.hist_rod_003.title',
    bodyKey: 'event.hist_rod_003.body',
    weight: 8,
    minTurn: 4,
    requiredFlags: ['scenario_rodrigazo_1975'],
    choices: [
      { id: 'hist_rod_003_a', textKey: 'event.hist_rod_003.choice_a', effects: { popularityDelta: -30, stabilityDelta: -25, inflationDelta: -15 } },
      { id: 'hist_rod_003_b', textKey: 'event.hist_rod_003.choice_b', effects: { popularityDelta: -45, stabilityDelta: -35 } },
      { id: 'hist_rod_003_c', textKey: 'event.hist_rod_003.choice_c', effects: { popularityDelta: -15, stabilityDelta: -20, inflationDelta: 5, mediaCredibilityDelta: -10 } },
    ],
  },

  // ── Malvinas 1982 ─────────────────────────────────────────────────────────
  {
    id: 'hist_mal_001',
    category: 'political',
    titleKey: 'event.hist_mal_001.title',
    bodyKey: 'event.hist_mal_001.body',
    weight: 10,
    minTurn: 1,
    maxTurn: 4,
    requiredFlags: ['scenario_malvinas_1982'],
    choices: [
      { id: 'hist_mal_001_a', textKey: 'event.hist_mal_001.choice_a', effects: { popularityDelta: 30, stabilityDelta: 15, marketConfidenceDelta: -20, deficitDelta: 15 } },
      { id: 'hist_mal_001_b', textKey: 'event.hist_mal_001.choice_b', effects: { popularityDelta: -20, stabilityDelta: -10, marketConfidenceDelta: 5 } },
      { id: 'hist_mal_001_c', textKey: 'event.hist_mal_001.choice_c', effects: { popularityDelta: 5, marketConfidenceDelta: -5, deficitDelta: 5 } },
    ],
  },
  {
    id: 'hist_mal_002',
    category: 'international',
    titleKey: 'event.hist_mal_002.title',
    bodyKey: 'event.hist_mal_002.body',
    weight: 9,
    minTurn: 3,
    requiredFlags: ['scenario_malvinas_1982'],
    choices: [
      { id: 'hist_mal_002_a', textKey: 'event.hist_mal_002.choice_a', effects: { popularityDelta: -10, deficitDelta: 20, foreignReservesDelta: -15 } },
      { id: 'hist_mal_002_b', textKey: 'event.hist_mal_002.choice_b', effects: { popularityDelta: 20, deficitDelta: 30, marketConfidenceDelta: -20 } },
      { id: 'hist_mal_002_c', textKey: 'event.hist_mal_002.choice_c', effects: { popularityDelta: 5, deficitDelta: 10, mediaCredibilityDelta: -8 } },
    ],
  },
  {
    id: 'hist_mal_003',
    category: 'political',
    titleKey: 'event.hist_mal_003.title',
    bodyKey: 'event.hist_mal_003.body',
    weight: 8,
    minTurn: 5,
    requiredFlags: ['scenario_malvinas_1982'],
    choices: [
      { id: 'hist_mal_003_a', textKey: 'event.hist_mal_003.choice_a', effects: { popularityDelta: -40, stabilityDelta: -30, marketConfidenceDelta: -20 } },
      { id: 'hist_mal_003_b', textKey: 'event.hist_mal_003.choice_b', effects: { popularityDelta: -25, stabilityDelta: -20, mediaCredibilityDelta: 10 } },
      { id: 'hist_mal_003_c', textKey: 'event.hist_mal_003.choice_c', effects: { popularityDelta: -20, inflationDelta: 10, deficitDelta: 10 } },
    ],
  },

  // ── Kirchnerismo Boom 2003–2007 ───────────────────────────────────────────
  {
    id: 'hist_kirch_001',
    category: 'economic',
    titleKey: 'event.hist_kirch_001.title',
    bodyKey: 'event.hist_kirch_001.body',
    weight: 10,
    minTurn: 1,
    maxTurn: 6,
    requiredFlags: ['scenario_kirchnerismo_boom'],
    choices: [
      { id: 'hist_kirch_001_a', textKey: 'event.hist_kirch_001.choice_a', effects: { popularityDelta: 15, stabilityDelta: 10, gdpGrowthDelta: 1.5, deficitDelta: 5 } },
      { id: 'hist_kirch_001_b', textKey: 'event.hist_kirch_001.choice_b', effects: { marketConfidenceDelta: 15, foreignReservesDelta: 10, popularityDelta: -5 } },
      { id: 'hist_kirch_001_c', textKey: 'event.hist_kirch_001.choice_c', effects: { popularityDelta: 8, gdpGrowthDelta: 0.8, inflationDelta: 3 } },
    ],
  },
  {
    id: 'hist_kirch_002',
    category: 'political',
    titleKey: 'event.hist_kirch_002.title',
    bodyKey: 'event.hist_kirch_002.body',
    weight: 9,
    minTurn: 4,
    requiredFlags: ['scenario_kirchnerismo_boom'],
    choices: [
      { id: 'hist_kirch_002_a', textKey: 'event.hist_kirch_002.choice_a', effects: { popularityDelta: 20, stabilityDelta: 15, inflationDelta: 5, deficitDelta: 8 } },
      { id: 'hist_kirch_002_b', textKey: 'event.hist_kirch_002.choice_b', effects: { marketConfidenceDelta: 10, inflationDelta: -3, popularityDelta: -10 } },
      { id: 'hist_kirch_002_c', textKey: 'event.hist_kirch_002.choice_c', effects: { popularityDelta: 10, stabilityDelta: 5, inflationDelta: 2 } },
    ],
  },
  {
    id: 'hist_kirch_003',
    category: 'economic',
    titleKey: 'event.hist_kirch_003.title',
    bodyKey: 'event.hist_kirch_003.body',
    weight: 8,
    minTurn: 8,
    requiredFlags: ['scenario_kirchnerismo_boom'],
    choices: [
      { id: 'hist_kirch_003_a', textKey: 'event.hist_kirch_003.choice_a', effects: { popularityDelta: 25, stabilityDelta: 10, inflationDelta: 15, deficitDelta: 15 } },
      { id: 'hist_kirch_003_b', textKey: 'event.hist_kirch_003.choice_b', effects: { popularityDelta: -15, inflationDelta: -8, marketConfidenceDelta: 15 } },
      { id: 'hist_kirch_003_c', textKey: 'event.hist_kirch_003.choice_c', effects: { popularityDelta: 5, inflationDelta: 8, deficitDelta: 10 } },
    ],
  },
];
