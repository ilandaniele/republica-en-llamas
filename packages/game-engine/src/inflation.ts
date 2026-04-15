import type { GameState, InflationBreakdown } from './types.js';
import { DIFFICULTY_MODIFIERS } from './constants.js';

function getActiveShockMultiplier(state: GameState): number {
  return state.activeShocks.reduce((sum, shock) => sum + shock.inflationMod, 0);
}

export function calculateInflation(state: GameState): number {
  const { publicDeficit, marketConfidence, currencyStrength } = state.economic;
  const base = state.economic.inflation;
  const monetary = (publicDeficit / 100) * 6;
  const confidence = ((100 - marketConfidence) / 100) * 5;
  const currency = ((100 - currencyStrength) / 100) * 4;
  const shock = getActiveShockMultiplier(state);
  // Natural decay: healthy markets + low deficit can lower inflation
  const naturalDecay = Math.max(0,
    ((marketConfidence - 40) / 60) * 3.5 + ((45 - publicDeficit) / 45) * 2.5
  );
  // Popularity buffer: strong political capital slightly relieves inflationary pressure
  const popularityBuffer = state.political.popularity > 70
    ? ((state.political.popularity - 70) / 100) * 1.5
    : 0;
  // Mean-reversion: when economy is healthy, base slowly declines toward floor
  const reversion = (marketConfidence > 60 && publicDeficit < 30)
    ? base * 0.03 * Math.max(0, Math.min(1, (marketConfidence - 60) / 40))
    : 0;
  // pressureDelta = only NEW forces pushing inflation this turn (not counting historical base)
  const pressureDelta = monetary + confidence + currency + shock - naturalDecay - popularityBuffer;
  const raw = base + pressureDelta - reversion;
  const mod = DIFFICULTY_MODIFIERS[state.difficulty] ?? DIFFICULTY_MODIFIERS['normal']!;
  const accelBlocked = state.turn < mod.inflationAccelerationTurn;
  // Accel amplifies only new pressure, not the historical base
  const accel = (!accelBlocked && raw > 15 && pressureDelta > 0) ? pressureDelta * 0.4 : 0;
  return Math.max(-20, Math.min(200, raw + accel));
}

export function calculateInflationBreakdown(state: GameState): InflationBreakdown {
  const { publicDeficit, marketConfidence, currencyStrength } = state.economic;
  const previousInflation = state.economic.inflation;
  const deficitPressure = (publicDeficit / 100) * 6;
  const marketDistrust = ((100 - marketConfidence) / 100) * 5;
  const currencyWeakness = ((100 - currencyStrength) / 100) * 4;
  const shockEffect = getActiveShockMultiplier(state);
  // Natural decay: healthy markets + low deficit can lower inflation
  const naturalDecay = Math.max(0,
    ((marketConfidence - 40) / 60) * 3.5 + ((45 - publicDeficit) / 45) * 2.5
  );
  // Popularity buffer: strong political capital slightly relieves inflationary pressure
  const popularityBuffer = state.political.popularity > 70
    ? ((state.political.popularity - 70) / 100) * 1.5
    : 0;
  // Mean-reversion: when economy is healthy, base slowly declines toward floor
  const reversion = (marketConfidence > 60 && publicDeficit < 30)
    ? previousInflation * 0.03 * Math.max(0, Math.min(1, (marketConfidence - 60) / 40))
    : 0;
  const pressureDelta = deficitPressure + marketDistrust + currencyWeakness + shockEffect - naturalDecay - popularityBuffer;
  const raw = previousInflation + pressureDelta - reversion;
  const mod = DIFFICULTY_MODIFIERS[state.difficulty] ?? DIFFICULTY_MODIFIERS['normal']!;
  const accelBlocked = state.turn < mod.inflationAccelerationTurn;
  const accelerationEffect = (!accelBlocked && raw > 15 && pressureDelta > 0) ? pressureDelta * 0.4 : 0;
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
