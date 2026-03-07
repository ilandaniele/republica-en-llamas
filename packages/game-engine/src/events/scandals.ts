import type { EventCard } from '../types.js';

export const SCANDAL_CARDS: EventCard[] = [
  // 1 — El Caso Loan
  {
    id: 'scn_001',
    category: 'political',
    titleKey: 'event.scn_001.title',
    bodyKey: 'event.scn_001.body',
    weight: 8,
    minDifficulty: 'normal',
    choices: [
      {
        id: 'scn_001_a',
        textKey: 'event.scn_001.choice_a',
        effects: { popularityDelta: 8, mediaCredibilityDelta: 10, stabilityDelta: -5 },
      },
      {
        id: 'scn_001_b',
        textKey: 'event.scn_001.choice_b',
        effects: { popularityDelta: -12, mediaCredibilityDelta: -15, stabilityDelta: -10 },
      },
      {
        id: 'scn_001_c',
        textKey: 'event.scn_001.choice_c',
        effects: { popularityDelta: -5, mediaCredibilityDelta: 5, stabilityDelta: 5 },
      },
      {
        id: 'scn_001_d',
        textKey: 'event.scn_001.choice_d',
        effects: { popularityDelta: -2, mediaCredibilityDelta: 8, stabilityDelta: 8 },
      },
    ],
  },
  // 2 — Los Rugbiers
  {
    id: 'scn_002',
    category: 'social',
    titleKey: 'event.scn_002.title',
    bodyKey: 'event.scn_002.body',
    weight: 7,
    choices: [
      {
        id: 'scn_002_a',
        textKey: 'event.scn_002.choice_a',
        effects: { popularityDelta: 10, stabilityDelta: 5, mediaCredibilityDelta: 8 },
      },
      {
        id: 'scn_002_b',
        textKey: 'event.scn_002.choice_b',
        effects: { popularityDelta: -8, stabilityDelta: -12, mediaCredibilityDelta: -10 },
      },
      {
        id: 'scn_002_c',
        textKey: 'event.scn_002.choice_c',
        effects: { popularityDelta: 3, stabilityDelta: -2, mediaCredibilityDelta: 5 },
      },
      {
        id: 'scn_002_d',
        textKey: 'event.scn_002.choice_d',
        effects: { popularityDelta: -3, mediaCredibilityDelta: -5 },
      },
    ],
  },
  // 3 — El Caso LIBRA (crypto)
  {
    id: 'scn_003',
    category: 'economic',
    titleKey: 'event.scn_003.title',
    bodyKey: 'event.scn_003.body',
    weight: 9,
    minDifficulty: 'normal',
    choices: [
      {
        id: 'scn_003_a',
        textKey: 'event.scn_003.choice_a',
        effects: { marketConfidenceDelta: -20, popularityDelta: -15, mediaCredibilityDelta: -12 },
      },
      {
        id: 'scn_003_b',
        textKey: 'event.scn_003.choice_b',
        effects: { marketConfidenceDelta: 5, popularityDelta: -8, mediaCredibilityDelta: 10 },
      },
      {
        id: 'scn_003_c',
        textKey: 'event.scn_003.choice_c',
        effects: { marketConfidenceDelta: -10, popularityDelta: 5, currencyStrengthDelta: -8 },
      },
      {
        id: 'scn_003_d',
        textKey: 'event.scn_003.choice_d',
        effects: { marketConfidenceDelta: -5, popularityDelta: -5, mediaCredibilityDelta: 15 },
      },
    ],
  },
  // 4 — PAMI Medicamentos
  {
    id: 'scn_004',
    category: 'social',
    titleKey: 'event.scn_004.title',
    bodyKey: 'event.scn_004.body',
    weight: 8,
    choices: [
      {
        id: 'scn_004_a',
        textKey: 'event.scn_004.choice_a',
        effects: { popularityDelta: 12, stabilityDelta: 11 },
      },
      {
        id: 'scn_004_b',
        textKey: 'event.scn_004.choice_b',
        effects: { popularityDelta: -15, stabilityDelta: -10 },
      },
      {
        id: 'scn_004_c',
        textKey: 'event.scn_004.choice_c',
        effects: { popularityDelta: -5, stabilityDelta: 6 },
      },
      {
        id: 'scn_004_d',
        textKey: 'event.scn_004.choice_d',
        effects: { popularityDelta: -3, stabilityDelta: 3, mediaCredibilityDelta: 8 },
      },
    ],
  },
  // 5 — Fiesta en Olivos
  {
    id: 'scn_005',
    category: 'political',
    titleKey: 'event.scn_005.title',
    bodyKey: 'event.scn_005.body',
    weight: 8,
    choices: [
      {
        id: 'scn_005_a',
        textKey: 'event.scn_005.choice_a',
        effects: { popularityDelta: -8, mediaCredibilityDelta: 5 },
      },
      {
        id: 'scn_005_b',
        textKey: 'event.scn_005.choice_b',
        effects: { popularityDelta: -18, mediaCredibilityDelta: -20, stabilityDelta: -8 },
      },
      {
        id: 'scn_005_c',
        textKey: 'event.scn_005.choice_c',
        effects: { popularityDelta: -12, mediaCredibilityDelta: -5, stabilityDelta: -5 },
      },
      {
        id: 'scn_005_d',
        textKey: 'event.scn_005.choice_d',
        effects: { popularityDelta: -8, mediaCredibilityDelta: 12, stabilityDelta: 3 },
      },
    ],
  },
  // 6 — Nisman 2.0
  {
    id: 'scn_006',
    category: 'political',
    titleKey: 'event.scn_006.title',
    bodyKey: 'event.scn_006.body',
    weight: 7,
    minDifficulty: 'normal',
    choices: [
      {
        id: 'scn_006_a',
        textKey: 'event.scn_006.choice_a',
        effects: { popularityDelta: 5, mediaCredibilityDelta: 12, stabilityDelta: -8 },
      },
      {
        id: 'scn_006_b',
        textKey: 'event.scn_006.choice_b',
        effects: { popularityDelta: -15, mediaCredibilityDelta: -18, stabilityDelta: -12 },
      },
      {
        id: 'scn_006_c',
        textKey: 'event.scn_006.choice_c',
        effects: { popularityDelta: -2, mediaCredibilityDelta: 7, stabilityDelta: -5 },
      },
      {
        id: 'scn_006_d',
        textKey: 'event.scn_006.choice_d',
        effects: { popularityDelta: -5, mediaCredibilityDelta: -3, stabilityDelta: -4 },
      },
    ],
  },
  // 7 — Los Cuadernos
  {
    id: 'scn_007',
    category: 'political',
    titleKey: 'event.scn_007.title',
    bodyKey: 'event.scn_007.body',
    weight: 8,
    minDifficulty: 'normal',
    choices: [
      {
        id: 'scn_007_a',
        textKey: 'event.scn_007.choice_a',
        effects: { popularityDelta: 10, mediaCredibilityDelta: 15, stabilityDelta: -10, deficitDelta: -5 },
      },
      {
        id: 'scn_007_b',
        textKey: 'event.scn_007.choice_b',
        effects: { popularityDelta: -20, mediaCredibilityDelta: -25, stabilityDelta: -15 },
      },
      {
        id: 'scn_007_c',
        textKey: 'event.scn_007.choice_c',
        effects: { popularityDelta: -8, mediaCredibilityDelta: 5, stabilityDelta: -5 },
      },
      {
        id: 'scn_007_d',
        textKey: 'event.scn_007.choice_d',
        effects: { popularityDelta: -3, mediaCredibilityDelta: 10, stabilityDelta: -3 },
      },
    ],
  },
  // 8 — Senadores con Sobre
  {
    id: 'scn_008',
    category: 'political',
    titleKey: 'event.scn_008.title',
    bodyKey: 'event.scn_008.body',
    weight: 7,
    minDifficulty: 'normal',
    choices: [
      {
        id: 'scn_008_a',
        textKey: 'event.scn_008.choice_a',
        effects: { popularityDelta: -10, mediaCredibilityDelta: -15, stabilityDelta: -8 },
      },
      {
        id: 'scn_008_b',
        textKey: 'event.scn_008.choice_b',
        effects: { popularityDelta: 8, mediaCredibilityDelta: 12, stabilityDelta: 5 },
      },
      {
        id: 'scn_008_c',
        textKey: 'event.scn_008.choice_c',
        effects: { popularityDelta: -5, mediaCredibilityDelta: 8, stabilityDelta: 5 },
      },
      {
        id: 'scn_008_d',
        textKey: 'event.scn_008.choice_d',
        effects: { popularityDelta: 5, mediaCredibilityDelta: -3, stabilityDelta: 2 },
      },
    ],
  },
  // 9 — Memorándum con Irán
  {
    id: 'scn_009',
    category: 'international',
    titleKey: 'event.scn_009.title',
    bodyKey: 'event.scn_009.body',
    weight: 7,
    minDifficulty: 'normal',
    choices: [
      {
        id: 'scn_009_a',
        textKey: 'event.scn_009.choice_a',
        effects: { popularityDelta: -12, mediaCredibilityDelta: -15, foreignReservesDelta: 10 },
      },
      {
        id: 'scn_009_b',
        textKey: 'event.scn_009.choice_b',
        effects: { popularityDelta: 5, mediaCredibilityDelta: 10, foreignReservesDelta: -5 },
      },
      {
        id: 'scn_009_c',
        textKey: 'event.scn_009.choice_c',
        effects: { popularityDelta: -5, mediaCredibilityDelta: 5, foreignReservesDelta: 5 },
      },
      {
        id: 'scn_009_d',
        textKey: 'event.scn_009.choice_d',
        effects: { popularityDelta: -3, mediaCredibilityDelta: 8, foreignReservesDelta: 3 },
      },
    ],
  },
  // 10 — Vacunas VIP
  {
    id: 'scn_010',
    category: 'social',
    titleKey: 'event.scn_010.title',
    bodyKey: 'event.scn_010.body',
    weight: 9,
    choices: [
      {
        id: 'scn_010_a',
        textKey: 'event.scn_010.choice_a',
        effects: { popularityDelta: -5, mediaCredibilityDelta: 8, stabilityDelta: 5 },
      },
      {
        id: 'scn_010_b',
        textKey: 'event.scn_010.choice_b',
        effects: { popularityDelta: -20, mediaCredibilityDelta: -18, stabilityDelta: -10 },
      },
      {
        id: 'scn_010_c',
        textKey: 'event.scn_010.choice_c',
        effects: { popularityDelta: -8, mediaCredibilityDelta: 10, stabilityDelta: 3 },
      },
      {
        id: 'scn_010_d',
        textKey: 'event.scn_010.choice_d',
        effects: { popularityDelta: -12, mediaCredibilityDelta: -8, stabilityDelta: -5 },
      },
    ],
  },
  // 11 — Reforma Previsional en la Calle
  {
    id: 'scn_011',
    category: 'social',
    titleKey: 'event.scn_011.title',
    bodyKey: 'event.scn_011.body',
    weight: 8,
    choices: [
      {
        id: 'scn_011_a',
        textKey: 'event.scn_011.choice_a',
        effects: { popularityDelta: 15, stabilityDelta: 14 },
      },
      {
        id: 'scn_011_b',
        textKey: 'event.scn_011.choice_b',
        effects: { popularityDelta: -20, stabilityDelta: -22 },
      },
      {
        id: 'scn_011_c',
        textKey: 'event.scn_011.choice_c',
        effects: { popularityDelta: -5, stabilityDelta: -3 },
      },
      {
        id: 'scn_011_d',
        textKey: 'event.scn_011.choice_d',
        effects: { popularityDelta: 5, stabilityDelta: 8, deficitDelta: 5 },
      },
    ],
  },
  // 12 — Buitres en Nueva York
  {
    id: 'scn_012',
    category: 'economic',
    titleKey: 'event.scn_012.title',
    bodyKey: 'event.scn_012.body',
    weight: 7,
    minDifficulty: 'normal',
    choices: [
      {
        id: 'scn_012_a',
        textKey: 'event.scn_012.choice_a',
        effects: { marketConfidenceDelta: 15, foreignReservesDelta: -20, popularityDelta: -8 },
      },
      {
        id: 'scn_012_b',
        textKey: 'event.scn_012.choice_b',
        effects: { marketConfidenceDelta: -15, foreignReservesDelta: 5, popularityDelta: 8 },
      },
      {
        id: 'scn_012_c',
        textKey: 'event.scn_012.choice_c',
        effects: { marketConfidenceDelta: 5, foreignReservesDelta: -8, popularityDelta: -3 },
      },
      {
        id: 'scn_012_d',
        textKey: 'event.scn_012.choice_d',
        effects: { marketConfidenceDelta: -5, foreignReservesDelta: 3, popularityDelta: 8 },
      },
    ],
  },
  // 13 — Derechos Especiales de Giro FMI
  {
    id: 'scn_013',
    category: 'economic',
    titleKey: 'event.scn_013.title',
    bodyKey: 'event.scn_013.body',
    weight: 6,
    minDifficulty: 'hard',
    choices: [
      {
        id: 'scn_013_a',
        textKey: 'event.scn_013.choice_a',
        effects: { foreignReservesDelta: 20, marketConfidenceDelta: 10, deficitDelta: -5 },
      },
      {
        id: 'scn_013_b',
        textKey: 'event.scn_013.choice_b',
        effects: { foreignReservesDelta: -10, marketConfidenceDelta: 15, popularityDelta: 5 },
      },
      {
        id: 'scn_013_c',
        textKey: 'event.scn_013.choice_c',
        effects: { foreignReservesDelta: 8, marketConfidenceDelta: -5, popularityDelta: 8 },
      },
      {
        id: 'scn_013_d',
        textKey: 'event.scn_013.choice_d',
        effects: { foreignReservesDelta: 12, marketConfidenceDelta: 5, popularityDelta: 3 },
      },
    ],
  },
  // 14 — Ley Bases: Sesión Extraordinaria (law card)
  {
    id: 'scn_014',
    category: 'political',
    titleKey: 'event.scn_014.title',
    bodyKey: 'event.scn_014.body',
    weight: 8,
    minDifficulty: 'normal',
    choices: [
      {
        id: 'scn_014_a',
        textKey: 'event.scn_014.choice_a',
        requiresVote: true,
        effects: { stabilityDelta: -3, popularityDelta: -6 },
      },
      {
        id: 'scn_014_b',
        textKey: 'event.scn_014.choice_b',
        effects: { stabilityDelta: 3, popularityDelta: 10 },
      },
      {
        id: 'scn_014_c',
        textKey: 'event.scn_014.choice_c',
        effects: { stabilityDelta: 2, popularityDelta: -5 },
      },
      {
        id: 'scn_014_d',
        textKey: 'event.scn_014.choice_d',
        effects: { stabilityDelta: 1, popularityDelta: -2 },
      },
    ],
  },
  // 15 — DNU Desregulatorio
  {
    id: 'scn_015',
    category: 'political',
    titleKey: 'event.scn_015.title',
    bodyKey: 'event.scn_015.body',
    weight: 8,
    minDifficulty: 'normal',
    choices: [
      {
        id: 'scn_015_a',
        textKey: 'event.scn_015.choice_a',
        effects: { popularityDelta: -12, stabilityDelta: -13 },
      },
      {
        id: 'scn_015_b',
        textKey: 'event.scn_015.choice_b',
        effects: { popularityDelta: 5, stabilityDelta: 10 },
      },
      {
        id: 'scn_015_c',
        textKey: 'event.scn_015.choice_c',
        effects: { popularityDelta: -5, stabilityDelta: 3 },
      },
      {
        id: 'scn_015_d',
        textKey: 'event.scn_015.choice_d',
        effects: { popularityDelta: 2, stabilityDelta: 5, deficitDelta: 2 },
      },
    ],
  },
  // 16 — Colapso de Silicon Valley Bank Argentina
  {
    id: 'scn_016',
    category: 'economic',
    titleKey: 'event.scn_016.title',
    bodyKey: 'event.scn_016.body',
    weight: 6,
    minDifficulty: 'hard',
    choices: [
      {
        id: 'scn_016_a',
        textKey: 'event.scn_016.choice_a',
        effects: { marketConfidenceDelta: 10, foreignReservesDelta: -15, deficitDelta: 5 },
      },
      {
        id: 'scn_016_b',
        textKey: 'event.scn_016.choice_b',
        effects: { marketConfidenceDelta: -20, foreignReservesDelta: -5, stabilityDelta: -15 },
      },
      {
        id: 'scn_016_c',
        textKey: 'event.scn_016.choice_c',
        effects: { marketConfidenceDelta: 5, deficitDelta: 3, foreignReservesDelta: -5 },
      },
      {
        id: 'scn_016_d',
        textKey: 'event.scn_016.choice_d',
        effects: { marketConfidenceDelta: 8, deficitDelta: 5, stabilityDelta: 5 },
      },
    ],
  },
  // 17 — Guerra en Medio Oriente: Argentina en el Medio
  {
    id: 'scn_017',
    category: 'international',
    titleKey: 'event.scn_017.title',
    bodyKey: 'event.scn_017.body',
    weight: 6,
    minDifficulty: 'normal',
    choices: [
      {
        id: 'scn_017_a',
        textKey: 'event.scn_017.choice_a',
        effects: { foreignReservesDelta: 10, popularityDelta: 5, marketConfidenceDelta: 8 },
      },
      {
        id: 'scn_017_b',
        textKey: 'event.scn_017.choice_b',
        effects: { foreignReservesDelta: -8, popularityDelta: -5, marketConfidenceDelta: -10 },
      },
      {
        id: 'scn_017_c',
        textKey: 'event.scn_017.choice_c',
        effects: { foreignReservesDelta: 5, popularityDelta: -3, marketConfidenceDelta: 3 },
      },
      {
        id: 'scn_017_d',
        textKey: 'event.scn_017.choice_d',
        effects: { foreignReservesDelta: 3, popularityDelta: -2, marketConfidenceDelta: 5, mediaCredibilityDelta: 5 },
      },
    ],
  },
  // 18 — Relaciones con China: El Swap
  {
    id: 'scn_018',
    category: 'international',
    titleKey: 'event.scn_018.title',
    bodyKey: 'event.scn_018.body',
    weight: 7,
    minDifficulty: 'normal',
    choices: [
      {
        id: 'scn_018_a',
        textKey: 'event.scn_018.choice_a',
        effects: { foreignReservesDelta: 18, marketConfidenceDelta: -8, popularityDelta: -5 },
      },
      {
        id: 'scn_018_b',
        textKey: 'event.scn_018.choice_b',
        effects: { foreignReservesDelta: -10, marketConfidenceDelta: 12, popularityDelta: 5 },
      },
      {
        id: 'scn_018_c',
        textKey: 'event.scn_018.choice_c',
        effects: { foreignReservesDelta: 10, marketConfidenceDelta: 4, popularityDelta: -2 },
      },
      {
        id: 'scn_018_d',
        textKey: 'event.scn_018.choice_d',
        effects: { foreignReservesDelta: 12, marketConfidenceDelta: -2, popularityDelta: -4 },
      },
    ],
  },
  // 19 — Ley de Financiamiento Universitario (law)
  {
    id: 'scn_019',
    category: 'social',
    titleKey: 'event.scn_019.title',
    bodyKey: 'event.scn_019.body',
    weight: 8,
    choices: [
      {
        id: 'scn_019_a',
        textKey: 'event.scn_019.choice_a',
        requiresVote: true,
        effects: { popularityDelta: 15, stabilityDelta: 15 },
      },
      {
        id: 'scn_019_b',
        textKey: 'event.scn_019.choice_b',
        effects: { popularityDelta: -18, stabilityDelta: -18 },
      },
      {
        id: 'scn_019_c',
        textKey: 'event.scn_019.choice_c',
        effects: { popularityDelta: -5, stabilityDelta: -2 },
      },
      {
        id: 'scn_019_d',
        textKey: 'event.scn_019.choice_d',
        effects: { popularityDelta: 3, stabilityDelta: 8, deficitDelta: 3 },
      },
    ],
  },
  // 20 — El Dólar a $1500
  {
    id: 'scn_020',
    category: 'economic',
    titleKey: 'event.scn_020.title',
    bodyKey: 'event.scn_020.body',
    weight: 9,
    minDifficulty: 'normal',
    choices: [
      {
        id: 'scn_020_a',
        textKey: 'event.scn_020.choice_a',
        effects: { currencyStrengthDelta: -20, inflationDelta: 15, popularityDelta: -15, marketConfidenceDelta: 5 },
      },
      {
        id: 'scn_020_b',
        textKey: 'event.scn_020.choice_b',
        effects: { currencyStrengthDelta: 5, foreignReservesDelta: -15, popularityDelta: 5, inflationDelta: 5 },
      },
      {
        id: 'scn_020_c',
        textKey: 'event.scn_020.choice_c',
        effects: { currencyStrengthDelta: -8, inflationDelta: 8, popularityDelta: -8, marketConfidenceDelta: -5 },
      },
      {
        id: 'scn_020_d',
        textKey: 'event.scn_020.choice_d',
        effects: { currencyStrengthDelta: -3, inflationDelta: 5, popularityDelta: -5, marketConfidenceDelta: -8 },
      },
    ],
  },
];
