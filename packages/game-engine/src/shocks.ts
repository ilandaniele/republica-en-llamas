import type { Shock } from './types.js';

interface ShockTemplate {
  id: string;
  nameKey: string;
  minTurn: number;
  weight: number;
  inflationMod: number;
  marketConfidenceMod: number;
  deficitMod: number;
  popularityMod: number;
  durationTurns: number;
}

const SHOCK_TEMPLATES: ShockTemplate[] = [
  {
    id: 'oil_price_spike',
    nameKey: 'shock.oilPriceSpike',
    minTurn: 3,
    weight: 20,
    inflationMod: 8,
    marketConfidenceMod: -10,
    deficitMod: 5,
    popularityMod: -5,
    durationTurns: 3,
  },
  {
    id: 'global_recession',
    nameKey: 'shock.globalRecession',
    minTurn: 5,
    weight: 15,
    inflationMod: 3,
    marketConfidenceMod: -20,
    deficitMod: 8,
    popularityMod: -8,
    durationTurns: 5,
  },
  {
    id: 'currency_attack',
    nameKey: 'shock.currencyAttack',
    minTurn: 8,
    weight: 12,
    inflationMod: 12,
    marketConfidenceMod: -15,
    deficitMod: 3,
    popularityMod: -6,
    durationTurns: 2,
  },
  {
    id: 'trade_war',
    nameKey: 'shock.tradeWar',
    minTurn: 10,
    weight: 10,
    inflationMod: 6,
    marketConfidenceMod: -12,
    deficitMod: 6,
    popularityMod: -4,
    durationTurns: 4,
  },
  {
    id: 'pandemic',
    nameKey: 'shock.pandemic',
    minTurn: 15,
    weight: 5,
    inflationMod: 10,
    marketConfidenceMod: -25,
    deficitMod: 15,
    popularityMod: -10,
    durationTurns: 4,
  },
  {
    id: 'natural_disaster',
    nameKey: 'shock.naturalDisaster',
    minTurn: 2,
    weight: 18,
    inflationMod: 4,
    marketConfidenceMod: -8,
    deficitMod: 10,
    popularityMod: 3,
    durationTurns: 2,
  },
  {
    id: 'tech_boom',
    nameKey: 'shock.techBoom',
    minTurn: 5,
    weight: 15,
    inflationMod: -3,
    marketConfidenceMod: 15,
    deficitMod: -3,
    popularityMod: 5,
    durationTurns: 3,
  },
  {
    id: 'foreign_investment',
    nameKey: 'shock.foreignInvestment',
    minTurn: 3,
    weight: 18,
    inflationMod: -2,
    marketConfidenceMod: 12,
    deficitMod: -5,
    popularityMod: 4,
    durationTurns: 3,
  },
];

const SHOCK_CHANCE_PER_TURN = 0.07;

export function rollInternationalShock(turn: number, rng: () => number): Shock | null {
  if (rng() > SHOCK_CHANCE_PER_TURN) return null;

  const eligible = SHOCK_TEMPLATES.filter((t) => t.minTurn <= turn);
  if (eligible.length === 0) return null;

  const totalWeight = eligible.reduce((s, t) => s + t.weight, 0);
  let roll = rng() * totalWeight;

  for (const template of eligible) {
    roll -= template.weight;
    if (roll <= 0) {
      return {
        id: `${template.id}_${turn}`,
        name: template.nameKey,
        turnsRemaining: template.durationTurns,
        inflationMod: template.inflationMod,
        marketConfidenceMod: template.marketConfidenceMod,
        deficitMod: template.deficitMod,
        popularityMod: template.popularityMod,
      };
    }
  }

  return null;
}

export function tickShocks(state: import('./types.js').GameState): import('./types.js').GameState {
  const updatedShocks = state.activeShocks
    .map((s) => ({ ...s, turnsRemaining: s.turnsRemaining - 1 }))
    .filter((s) => s.turnsRemaining > 0);

  return {
    ...state,
    activeShocks: updatedShocks,
  };
}
