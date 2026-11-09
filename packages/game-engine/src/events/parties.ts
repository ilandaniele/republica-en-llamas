import type { EventCard } from '../types.js';

// Fictional gameplay tradeoffs inspired by political agendas, not forecasts.
export const PARTY_CARDS: EventCard[] = [
  {
    id: 'party_libertario_fiscal',
    category: 'economic',
    requiredParty: 'libertario',
    titleKey: 'event.party_libertario_fiscal.title',
    bodyKey: 'event.party_libertario_fiscal.body',
    weight: 10,
    minTurn: 1,
    choices: [
      {
        id: 'party_libertario_fiscal_a',
        textKey: 'event.party_libertario_fiscal.choice_a',
        effects: {
          deficitDelta: -10,
          popularityDelta: -8,
          marketConfidenceDelta: 6,
        },
      },
      {
        id: 'party_libertario_fiscal_b',
        textKey: 'event.party_libertario_fiscal.choice_b',
        effects: {
          deficitDelta: -4,
          stabilityDelta: 3,
          mediaCredibilityDelta: -2,
        },
      },
      {
        id: 'party_libertario_fiscal_c',
        textKey: 'event.party_libertario_fiscal.choice_c',
        effects: {
          popularityDelta: 6,
          deficitDelta: 5,
        },
      },
    ],
  },
  {
    id: 'party_libertario_reglas',
    category: 'economic',
    requiredParty: 'libertario',
    titleKey: 'event.party_libertario_reglas.title',
    bodyKey: 'event.party_libertario_reglas.body',
    weight: 10,
    minTurn: 6,
    choices: [
      {
        id: 'party_libertario_reglas_a',
        textKey: 'event.party_libertario_reglas.choice_a',
        effects: {
          marketConfidenceDelta: 8,
          gdpGrowthDelta: 1,
          stabilityDelta: -6,
        },
      },
      {
        id: 'party_libertario_reglas_b',
        textKey: 'event.party_libertario_reglas.choice_b',
        effects: {
          marketConfidenceDelta: 3,
          mediaCredibilityDelta: 3,
          deficitDelta: 2,
        },
      },
      {
        id: 'party_libertario_reglas_c',
        textKey: 'event.party_libertario_reglas.choice_c',
        effects: {
          stabilityDelta: 5,
          marketConfidenceDelta: -5,
        },
      },
    ],
  },
  {
    id: 'party_peronista_obra',
    category: 'economic',
    requiredParty: 'peronista',
    titleKey: 'event.party_peronista_obra.title',
    bodyKey: 'event.party_peronista_obra.body',
    weight: 10,
    minTurn: 1,
    choices: [
      {
        id: 'party_peronista_obra_a',
        textKey: 'event.party_peronista_obra.choice_a',
        effects: {
          popularityDelta: 7,
          gdpGrowthDelta: 1,
          deficitDelta: 7,
        },
      },
      {
        id: 'party_peronista_obra_b',
        textKey: 'event.party_peronista_obra.choice_b',
        effects: {
          stabilityDelta: 4,
          deficitDelta: 3,
        },
      },
      {
        id: 'party_peronista_obra_c',
        textKey: 'event.party_peronista_obra.choice_c',
        effects: {
          deficitDelta: -5,
          popularityDelta: -6,
        },
      },
    ],
  },
  {
    id: 'party_peronista_tarifas',
    category: 'economic',
    requiredParty: 'peronista',
    titleKey: 'event.party_peronista_tarifas.title',
    bodyKey: 'event.party_peronista_tarifas.body',
    weight: 10,
    minTurn: 6,
    choices: [
      {
        id: 'party_peronista_tarifas_a',
        textKey: 'event.party_peronista_tarifas.choice_a',
        effects: {
          popularityDelta: 7,
          deficitDelta: 7,
          marketConfidenceDelta: -3,
        },
      },
      {
        id: 'party_peronista_tarifas_b',
        textKey: 'event.party_peronista_tarifas.choice_b',
        effects: {
          popularityDelta: 3,
          deficitDelta: 2,
          mediaCredibilityDelta: 2,
        },
      },
      {
        id: 'party_peronista_tarifas_c',
        textKey: 'event.party_peronista_tarifas.choice_c',
        effects: {
          deficitDelta: -7,
          popularityDelta: -7,
          stabilityDelta: -3,
        },
      },
    ],
  },
  {
    id: 'party_pro_inversion',
    category: 'economic',
    requiredParty: 'pro',
    titleKey: 'event.party_pro_inversion.title',
    bodyKey: 'event.party_pro_inversion.body',
    weight: 10,
    minTurn: 1,
    choices: [
      {
        id: 'party_pro_inversion_a',
        textKey: 'event.party_pro_inversion.choice_a',
        effects: {
          marketConfidenceDelta: 8,
          deficitDelta: 5,
        },
      },
      {
        id: 'party_pro_inversion_b',
        textKey: 'event.party_pro_inversion.choice_b',
        effects: {
          marketConfidenceDelta: 4,
          mediaCredibilityDelta: 4,
          deficitDelta: 2,
        },
      },
      {
        id: 'party_pro_inversion_c',
        textKey: 'event.party_pro_inversion.choice_c',
        effects: {
          popularityDelta: 5,
          deficitDelta: 6,
          marketConfidenceDelta: -5,
        },
      },
    ],
  },
  {
    id: 'party_pro_apertura',
    category: 'economic',
    requiredParty: 'pro',
    titleKey: 'event.party_pro_apertura.title',
    bodyKey: 'event.party_pro_apertura.body',
    weight: 10,
    minTurn: 6,
    choices: [
      {
        id: 'party_pro_apertura_a',
        textKey: 'event.party_pro_apertura.choice_a',
        effects: {
          marketConfidenceDelta: 7,
          inflationDelta: -3,
          stabilityDelta: -7,
        },
      },
      {
        id: 'party_pro_apertura_b',
        textKey: 'event.party_pro_apertura.choice_b',
        effects: {
          marketConfidenceDelta: 3,
          stabilityDelta: 2,
          mediaCredibilityDelta: -2,
        },
      },
      {
        id: 'party_pro_apertura_c',
        textKey: 'event.party_pro_apertura.choice_c',
        effects: { stabilityDelta: 5, marketConfidenceDelta: -4 },
      },
    ],
  },
  {
    id: 'party_izquierda_jornada',
    category: 'social',
    requiredParty: 'izquierda',
    titleKey: 'event.party_izquierda_jornada.title',
    bodyKey: 'event.party_izquierda_jornada.body',
    weight: 10,
    minTurn: 1,
    choices: [
      {
        id: 'party_izquierda_jornada_a',
        textKey: 'event.party_izquierda_jornada.choice_a',
        effects: {
          popularityDelta: 7,
          stabilityDelta: 5,
          marketConfidenceDelta: -8,
        },
      },
      {
        id: 'party_izquierda_jornada_b',
        textKey: 'event.party_izquierda_jornada.choice_b',
        effects: {
          stabilityDelta: 4,
          marketConfidenceDelta: -2,
          deficitDelta: 2,
        },
      },
      {
        id: 'party_izquierda_jornada_c',
        textKey: 'event.party_izquierda_jornada.choice_c',
        effects: {
          marketConfidenceDelta: 5,
          deficitDelta: 4,
          popularityDelta: -3,
        },
      },
    ],
  },
  {
    id: 'party_izquierda_banca',
    category: 'economic',
    requiredParty: 'izquierda',
    titleKey: 'event.party_izquierda_banca.title',
    bodyKey: 'event.party_izquierda_banca.body',
    weight: 10,
    minTurn: 6,
    choices: [
      {
        id: 'party_izquierda_banca_a',
        textKey: 'event.party_izquierda_banca.choice_a',
        effects: {
          popularityDelta: 6,
          marketConfidenceDelta: -9,
          foreignReservesDelta: -4,
        },
      },
      {
        id: 'party_izquierda_banca_b',
        textKey: 'event.party_izquierda_banca.choice_b',
        effects: {
          popularityDelta: 4,
          deficitDelta: 4,
          mediaCredibilityDelta: 3,
        },
      },
      {
        id: 'party_izquierda_banca_c',
        textKey: 'event.party_izquierda_banca.choice_c',
        effects: {
          marketConfidenceDelta: 6,
          popularityDelta: -5,
        },
      },
    ],
  },
  {
    id: 'party_federal_fondos',
    category: 'economic',
    requiredParty: 'federal',
    titleKey: 'event.party_federal_fondos.title',
    bodyKey: 'event.party_federal_fondos.body',
    weight: 10,
    minTurn: 1,
    choices: [
      {
        id: 'party_federal_fondos_a',
        textKey: 'event.party_federal_fondos.choice_a',
        effects: {
          stabilityDelta: 7,
          governmentSeatsDelta: 4,
          deficitDelta: 6,
        },
      },
      {
        id: 'party_federal_fondos_b',
        textKey: 'event.party_federal_fondos.choice_b',
        effects: {
          stabilityDelta: 4,
          mediaCredibilityDelta: 3,
          deficitDelta: 2,
        },
      },
      {
        id: 'party_federal_fondos_c',
        textKey: 'event.party_federal_fondos.choice_c',
        effects: {
          deficitDelta: -4,
          stabilityDelta: -6,
        },
      },
    ],
  },
  {
    id: 'party_federal_rutas',
    category: 'economic',
    requiredParty: 'federal',
    titleKey: 'event.party_federal_rutas.title',
    bodyKey: 'event.party_federal_rutas.body',
    weight: 10,
    minTurn: 6,
    choices: [
      {
        id: 'party_federal_rutas_a',
        textKey: 'event.party_federal_rutas.choice_a',
        effects: {
          gdpGrowthDelta: 1,
          stabilityDelta: 5,
          deficitDelta: 6,
        },
      },
      {
        id: 'party_federal_rutas_b',
        textKey: 'event.party_federal_rutas.choice_b',
        effects: {
          stabilityDelta: 3,
          deficitDelta: 2,
          mediaCredibilityDelta: 2,
        },
      },
      {
        id: 'party_federal_rutas_c',
        textKey: 'event.party_federal_rutas.choice_c',
        effects: {
          marketConfidenceDelta: 6,
          popularityDelta: -4,
        },
      },
    ],
  },
];
