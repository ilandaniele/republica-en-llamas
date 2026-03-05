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
    ],
  },
];
