import type { GameState, InflationBreakdown } from './types.js';
import { DIFFICULTY_MODIFIERS } from './constants.js';
import { clamp } from './utils.js';

// Inflation drifts toward a target set by the economy's fundamentals instead of piling up forever.
const MAX_TARGET_INFLATION = 160;
const ADJUSTMENT_RATE = 0.2;
const EXPECTATIONS_RATE = 0.1;

function getActiveShockInflation(state: GameState): number {
  return state.activeShocks.reduce((sum, shock) => sum + shock.inflationMod, 0);
}

export function calculateInflationBreakdown(state: GameState): InflationBreakdown {
  const { inflation: previousInflation, publicDeficit, marketConfidence, currencyStrength } = state.economic;
  const stresses = [publicDeficit, 100 - marketConfidence, 100 - currencyStrength].map(
    (value) => clamp(value, 0, 100) / 100,
  );
  const totalStress = stresses.reduce((sum, stress) => sum + stress, 0);
  const fundamentalsTarget = MAX_TARGET_INFLATION * (totalStress / stresses.length) ** 3;
  const [deficitPressure, marketDistrust, currencyWeakness] = stresses.map((stress) =>
    totalStress === 0 ? 0 : fundamentalsTarget * (stress / totalStress) * ADJUSTMENT_RATE,
  ) as [number, number, number];
  const shockEffect = getActiveShockInflation(state) * ADJUSTMENT_RATE;
  const naturalDecay = -previousInflation * ADJUSTMENT_RATE;

  const gap = deficitPressure + marketDistrust + currencyWeakness + shockEffect + naturalDecay;
  const mod = DIFFICULTY_MODIFIERS[state.difficulty] ?? DIFFICULTY_MODIFIERS['normal']!;
  const expectationsActive = state.turn >= mod.inflationAccelerationTurn && gap > 0;
  const accelerationEffect = expectationsActive ? (gap / ADJUSTMENT_RATE) * EXPECTATIONS_RATE : 0;

  const newInflation = clamp(previousInflation + gap + accelerationEffect, -20, 200);
  return {
    deficitPressure,
    marketDistrust,
    currencyWeakness,
    shockEffect,
    naturalDecay,
    accelerationEffect,
    previousInflation,
    newInflation,
    delta: newInflation - previousInflation,
  };
}

export function calculateInflation(state: GameState): number {
  return calculateInflationBreakdown(state).newInflation;
}
