import type { GameState, Crisis, CrisisType } from './types.js';
import { CRISIS_THRESHOLDS, CRISIS_RESOLVE_TURNS, DIFFICULTY_MODIFIERS } from './constants.js';

type CrisisTrigger = (state: GameState) => boolean;

const CRISIS_TRIGGERS: Record<CrisisType, CrisisTrigger> = {
  debtCrisis: ({ economic }) =>
    economic.publicDeficit >= CRISIS_THRESHOLDS.debtCrisis['publicDeficit']! &&
    economic.marketConfidence <= CRISIS_THRESHOLDS.debtCrisis['marketConfidence']!,
  hyperinflationSpiral: ({ economic }) =>
    economic.inflation >= CRISIS_THRESHOLDS.hyperinflationSpiral['inflation']! &&
    economic.currencyStrength <= CRISIS_THRESHOLDS.hyperinflationSpiral['currencyStrength']!,
  socialUnrest: ({ political }) =>
    political.socialStability <= CRISIS_THRESHOLDS.socialUnrest['socialStability']! &&
    political.popularity <= CRISIS_THRESHOLDS.socialUnrest['popularity']!,
  legislativeRebellion: ({ political, congress }) =>
    congress.governmentSeats <= CRISIS_THRESHOLDS.legislativeRebellion['governmentSeats']! &&
    political.socialStability <= CRISIS_THRESHOLDS.legislativeRebellion['socialStability']!,
  impeachmentAttempt: ({ political }) =>
    political.popularity <= CRISIS_THRESHOLDS.impeachmentAttempt['popularity']! &&
    political.mediaCredibility <= CRISIS_THRESHOLDS.impeachmentAttempt['mediaCredibility']! &&
    political.socialStability <= CRISIS_THRESHOLDS.impeachmentAttempt['socialStability']!,
};

export function detectCrises(state: GameState): Crisis[] {
  const existingTypes = new Set(state.activeCrises.map((c) => c.type));
  const mod = DIFFICULTY_MODIFIERS[state.difficulty] ?? DIFFICULTY_MODIFIERS['normal']!;
  const minTurn = (type: CrisisType) =>
    type === 'impeachmentAttempt' ? mod.impeachmentMinTurn : mod.crisisMinTurn;

  return (Object.keys(CRISIS_TRIGGERS) as CrisisType[])
    .filter((type) => !existingTypes.has(type) && state.turn >= minTurn(type) && CRISIS_TRIGGERS[type](state))
    .map((type) => makeCrisis(type, state.turn));
}

function makeCrisis(type: CrisisType, turn: number): Crisis {
  return {
    type,
    startTurn: turn,
    turnsActive: 0,
    turnsToResolve: CRISIS_RESOLVE_TURNS[type],
    resolved: false,
  };
}

export function isCrisisResolved(crisis: Crisis, state: GameState): boolean {
  const { political, economic, congress } = state;

  switch (crisis.type) {
    case 'debtCrisis':
      return (
        economic.publicDeficit < CRISIS_THRESHOLDS.debtCrisis['publicDeficit']! - 10 ||
        economic.marketConfidence > CRISIS_THRESHOLDS.debtCrisis['marketConfidence']! + 10
      );
    case 'hyperinflationSpiral':
      return (
        economic.inflation < CRISIS_THRESHOLDS.hyperinflationSpiral['inflation']! - 10 &&
        economic.currencyStrength > CRISIS_THRESHOLDS.hyperinflationSpiral['currencyStrength']! + 10
      );
    case 'socialUnrest':
      return (
        political.socialStability > CRISIS_THRESHOLDS.socialUnrest['socialStability']! + 10 ||
        political.popularity > CRISIS_THRESHOLDS.socialUnrest['popularity']! + 10
      );
    case 'legislativeRebellion':
      return (
        congress.governmentSeats > CRISIS_THRESHOLDS.legislativeRebellion['governmentSeats']! + 20 ||
        political.socialStability > CRISIS_THRESHOLDS.legislativeRebellion['socialStability']! + 10
      );
    case 'impeachmentAttempt':
      return (
        political.popularity > CRISIS_THRESHOLDS.impeachmentAttempt['popularity']! + 15 &&
        political.mediaCredibility > CRISIS_THRESHOLDS.impeachmentAttempt['mediaCredibility']! + 15
      );
    default:
      return false;
  }
}

export function tickCrises(state: GameState): GameState {
  const updatedCrises = state.activeCrises
    .map((c) => ({
      ...c,
      turnsActive: c.turnsActive + 1,
      resolved: c.resolved || isCrisisResolved(c, state),
    }))
    .filter((c) => !c.resolved);

  return {
    ...state,
    activeCrises: updatedCrises,
  };
}
