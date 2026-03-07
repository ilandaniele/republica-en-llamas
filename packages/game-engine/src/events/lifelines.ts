import type { EventCard } from '../types.js';

export const LIFELINE_CARDS: EventCard[] = [
  {
    id: 'life_pop_001',
    category: 'political',
    titleKey: 'event.life_pop_001.title',
    bodyKey: 'event.life_pop_001.body',
    weight: 3,
    isLifeline: true,
    lifelineFor: ['popularity'],
    choices: [
      {
        id: 'life_pop_001_a',
        textKey: 'event.life_pop_001.choice_a',
        effects: { popularityDelta: 20, deficitDelta: 4, stabilityDelta: 8 },
      },
      {
        id: 'life_pop_001_b',
        textKey: 'event.life_pop_001.choice_b',
        effects: { popularityDelta: 8, mediaCredibilityDelta: 5 },
      },
      {
        id: 'life_pop_001_c',
        textKey: 'event.life_pop_001.choice_c',
        effects: { popularityDelta: 12, deficitDelta: 6, stabilityDelta: 5 },
      },
      {
        id: 'life_pop_001_d',
        textKey: 'event.life_pop_001.choice_d',
        effects: { popularityDelta: 10, mediaCredibilityDelta: 5, stabilityDelta: 3 },
      },
    ],
  },
  {
    id: 'life_stab_001',
    category: 'social',
    titleKey: 'event.life_stab_001.title',
    bodyKey: 'event.life_stab_001.body',
    weight: 3,
    isLifeline: true,
    lifelineFor: ['socialStability'],
    choices: [
      {
        id: 'life_stab_001_a',
        textKey: 'event.life_stab_001.choice_a',
        effects: { stabilityDelta: 20, popularityDelta: 5, deficitDelta: 3 },
      },
      {
        id: 'life_stab_001_b',
        textKey: 'event.life_stab_001.choice_b',
        effects: { stabilityDelta: 10, mediaCredibilityDelta: 5 },
      },
      {
        id: 'life_stab_001_c',
        textKey: 'event.life_stab_001.choice_c',
        effects: { stabilityDelta: 15, popularityDelta: 3, deficitDelta: 2 },
      },
      {
        id: 'life_stab_001_d',
        textKey: 'event.life_stab_001.choice_d',
        effects: { stabilityDelta: 12, popularityDelta: 2, mediaCredibilityDelta: 4 },
      },
    ],
  },
  {
    id: 'life_inf_001',
    category: 'economic',
    titleKey: 'event.life_inf_001.title',
    bodyKey: 'event.life_inf_001.body',
    weight: 3,
    isLifeline: true,
    lifelineFor: ['inflation'],
    choices: [
      {
        id: 'life_inf_001_a',
        textKey: 'event.life_inf_001.choice_a',
        effects: { inflationDelta: -20, popularityDelta: -5, marketConfidenceDelta: 10 },
      },
      {
        id: 'life_inf_001_b',
        textKey: 'event.life_inf_001.choice_b',
        effects: { inflationDelta: -10, popularityDelta: 2 },
      },
      {
        id: 'life_inf_001_c',
        textKey: 'event.life_inf_001.choice_c',
        effects: { inflationDelta: -15, popularityDelta: -3, marketConfidenceDelta: 8 },
      },
      {
        id: 'life_inf_001_d',
        textKey: 'event.life_inf_001.choice_d',
        effects: { inflationDelta: -8, popularityDelta: 5, marketConfidenceDelta: -3 },
      },
    ],
  },
  {
    id: 'life_mkt_001',
    category: 'economic',
    titleKey: 'event.life_mkt_001.title',
    bodyKey: 'event.life_mkt_001.body',
    weight: 3,
    isLifeline: true,
    lifelineFor: ['marketConfidence'],
    choices: [
      {
        id: 'life_mkt_001_a',
        textKey: 'event.life_mkt_001.choice_a',
        effects: { marketConfidenceDelta: 20, deficitDelta: 5, inflationDelta: 2 },
      },
      {
        id: 'life_mkt_001_b',
        textKey: 'event.life_mkt_001.choice_b',
        effects: { popularityDelta: 5, marketConfidenceDelta: 5 },
      },
      {
        id: 'life_mkt_001_c',
        textKey: 'event.life_mkt_001.choice_c',
        effects: { marketConfidenceDelta: 15, deficitDelta: 2, popularityDelta: 3 },
      },
      {
        id: 'life_mkt_001_d',
        textKey: 'event.life_mkt_001.choice_d',
        effects: { marketConfidenceDelta: 12, foreignReservesDelta: 3, deficitDelta: -2 },
      },
    ],
  },
  {
    id: 'life_cur_001',
    category: 'economic',
    titleKey: 'event.life_cur_001.title',
    bodyKey: 'event.life_cur_001.body',
    weight: 3,
    isLifeline: true,
    lifelineFor: ['currencyStrength'],
    choices: [
      {
        id: 'life_cur_001_a',
        textKey: 'event.life_cur_001.choice_a',
        effects: { currencyStrengthDelta: 20, marketConfidenceDelta: 8, foreignReservesDelta: -8 },
      },
      {
        id: 'life_cur_001_b',
        textKey: 'event.life_cur_001.choice_b',
        effects: { popularityDelta: 5, currencyStrengthDelta: -5, inflationDelta: 5 },
      },
      {
        id: 'life_cur_001_c',
        textKey: 'event.life_cur_001.choice_c',
        effects: { currencyStrengthDelta: 15, marketConfidenceDelta: 5, deficitDelta: 2 },
      },
      {
        id: 'life_cur_001_d',
        textKey: 'event.life_cur_001.choice_d',
        effects: { currencyStrengthDelta: 12, foreignReservesDelta: -10, marketConfidenceDelta: 5 },
      },
    ],
  },
  {
    id: 'life_res_001',
    category: 'international',
    titleKey: 'event.life_res_001.title',
    bodyKey: 'event.life_res_001.body',
    weight: 3,
    isLifeline: true,
    lifelineFor: ['foreignReserves'],
    choices: [
      {
        id: 'life_res_001_a',
        textKey: 'event.life_res_001.choice_a',
        effects: { foreignReservesDelta: 20, currencyStrengthDelta: 8, marketConfidenceDelta: 5 },
      },
      {
        id: 'life_res_001_b',
        textKey: 'event.life_res_001.choice_b',
        effects: { popularityDelta: 8, foreignReservesDelta: -5 },
      },
      {
        id: 'life_res_001_c',
        textKey: 'event.life_res_001.choice_c',
        effects: { foreignReservesDelta: 15, currencyStrengthDelta: 5, deficitDelta: 3 },
      },
      {
        id: 'life_res_001_d',
        textKey: 'event.life_res_001.choice_d',
        effects: { foreignReservesDelta: 12, marketConfidenceDelta: 3, popularityDelta: -3 },
      },
    ],
  },
];
