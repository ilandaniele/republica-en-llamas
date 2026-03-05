import type { GameState, Crisis, CrisisType } from './types.js';
import { CRISIS_THRESHOLDS, CRISIS_RESOLVE_TURNS, DIFFICULTY_MODIFIERS } from './constants.js';

export function detectCrises(state: GameState): Crisis[] {
  const newCrises: Crisis[] = [];
  const existingTypes = new Set(state.activeCrises.map((c) => c.type));
  const mod = DIFFICULTY_MODIFIERS[state.difficulty] ?? DIFFICULTY_MODIFIERS['normal']!;

  const { political, economic, congress } = state;
  const turn = state.turn;

  // Debt crisis
  if (
    !existingTypes.has('debtCrisis') &&
    turn >= mod.crisisMinTurn &&
    economic.publicDeficit >= CRISIS_THRESHOLDS.debtCrisis['publicDeficit']! &&
    economic.marketConfidence <= CRISIS_THRESHOLDS.debtCrisis['marketConfidence']!
  ) {
    newCrises.push(makeCrisis('debtCrisis', turn));
  }

  // Hyperinflation spiral
  if (
    !existingTypes.has('hyperinflationSpiral') &&
    turn >= mod.crisisMinTurn &&
    economic.inflation >= CRISIS_THRESHOLDS.hyperinflationSpiral['inflation']! &&
    economic.currencyStrength <= CRISIS_THRESHOLDS.hyperinflationSpiral['currencyStrength']!
  ) {
    newCrises.push(makeCrisis('hyperinflationSpiral', turn));
  }

  // Social unrest
  if (
    !existingTypes.has('socialUnrest') &&
    turn >= mod.crisisMinTurn &&
    political.socialStability <= CRISIS_THRESHOLDS.socialUnrest['socialStability']! &&
    political.popularity <= CRISIS_THRESHOLDS.socialUnrest['popularity']!
  ) {
    newCrises.push(makeCrisis('socialUnrest', turn));
  }

  // Legislative rebellion
  if (
    !existingTypes.has('legislativeRebellion') &&
    turn >= mod.crisisMinTurn &&
    congress.governmentSeats <= CRISIS_THRESHOLDS.legislativeRebellion['governmentSeats']! &&
    political.socialStability <= CRISIS_THRESHOLDS.legislativeRebellion['socialStability']!
  ) {
    newCrises.push(makeCrisis('legislativeRebellion', turn));
  }

  // Impeachment attempt (has its own separate min-turn guard)
  if (
    !existingTypes.has('impeachmentAttempt') &&
    turn >= mod.impeachmentMinTurn &&
    political.popularity <= CRISIS_THRESHOLDS.impeachmentAttempt['popularity']! &&
    political.mediaCredibility <= CRISIS_THRESHOLDS.impeachmentAttempt['mediaCredibility']! &&
    political.socialStability <= CRISIS_THRESHOLDS.impeachmentAttempt['socialStability']!
  ) {
    newCrises.push(makeCrisis('impeachmentAttempt', turn));
  }

  return newCrises;
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
