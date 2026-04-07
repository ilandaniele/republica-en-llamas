import type { GameState, InflationBreakdown } from './types.js';
import { DIFFICULTY_MODIFIERS } from './constants.js';

function getActiveShockMultiplier(state: GameState): number {
  return state.activeShocks.reduce((sum, shock) => sum + shock.inflationMod, 0);
}

export function calculateInflation(state: GameState): number {
  const { publicDeficit, marketConfidence, currencyStrength } = state.economic;
  const base = state.economic.inflation;
  const monetary = (publicDeficit / 100) * 8;
  const confidence = ((100 - marketConfidence) / 100) * 6;
  const currency = ((100 - currencyStrength) / 100) * 5;
  const shock = getActiveShockMultiplier(state);
  // Natural decay: healthy markets + low deficit can lower inflation
  const naturalDecay = Math.max(0,
    ((marketConfidence - 55) / 50) * 2.5 + ((30 - publicDeficit) / 30) * 1.5
  );
  // Popularity buffer: strong political capital slightly relieves inflationary pressure
  const popularityBuffer = state.political.popularity > 70
    ? ((state.political.popularity - 70) / 100) * 1.5
    : 0;
  const raw = base + monetary + confidence + currency + shock - naturalDecay - popularityBuffer;
  const mod = DIFFICULTY_MODIFIERS[state.difficulty] ?? DIFFICULTY_MODIFIERS['normal']!;
  const accelBlocked = state.turn < mod.inflationAccelerationTurn;
  const accel = (!accelBlocked && raw > 15) ? raw * 0.25 : 0;
  return Math.max(-20, Math.min(200, raw + accel));
}

export function calculateInflationBreakdown(state: GameState): InflationBreakdown {
  const { publicDeficit, marketConfidence, currencyStrength } = state.economic;
  const previousInflation = state.economic.inflation;
  const deficitPressure = (publicDeficit / 100) * 8;
  const marketDistrust = ((100 - marketConfidence) / 100) * 6;
  const currencyWeakness = ((100 - currencyStrength) / 100) * 5;
  const shockEffect = getActiveShockMultiplier(state);
  // Natural decay: healthy markets + low deficit can lower inflation
  const naturalDecay = Math.max(0,
    ((marketConfidence - 55) / 50) * 2.5 + ((30 - publicDeficit) / 30) * 1.5
  );
  // Popularity buffer: strong political capital slightly relieves inflationary pressure
  const popularityBuffer = state.political.popularity > 70
    ? ((state.political.popularity - 70) / 100) * 1.5
    : 0;
  const raw = previousInflation + deficitPressure + marketDistrust + currencyWeakness + shockEffect - naturalDecay - popularityBuffer;
  const mod = DIFFICULTY_MODIFIERS[state.difficulty] ?? DIFFICULTY_MODIFIERS['normal']!;
  const accelBlocked = state.turn < mod.inflationAccelerationTurn;
  const accelerationEffect = (!accelBlocked && raw > 15) ? raw * 0.25 : 0;
  const newInflation = Math.max(-20, Math.min(200, raw + accelerationEffect));
  return {
    deficitPressure,
    marketDistrust,
    currencyWeakness,
    shockEffect,
    naturalDecay: -naturalDecay - popularityBuffer,
    accelerationEffect,
    previousInflation,
    newInflation,
    delta: newInflation - previousInflation,
  };
}
