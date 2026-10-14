import type { ChoiceEffect, GameState } from './types.js';
import { createRng } from './utils.js';

export type CongressActionId = 'radical' | 'presupuesto' | 'cadena' | 'gobernadores' | 'decreto';
export type SwingLegislatorId =
  | 'urquiza'
  | 'ferreyra'
  | 'dominguez'
  | 'paz'
  | 'villegas'
  | 'rios'
  | 'medina'
  | 'torres'
  | 'blanco'
  | 'caceres';
export type SwingChoice = 'accept' | 'refuse' | 'decide';

export interface CongressDecisions {
  actions: CongressActionId[];
  swingChoices: SwingChoice[];
}

export interface CongressOutcome {
  actionPointsLeft: number;
  bonusVotes: number;
  usedDecree: boolean;
  totalSeats: number;
  requiredVotes: number;
  independentYesPercent: number;
  votingYes: number;
  swingCandidates: SwingLegislatorId[];
  finalYes: number;
  passed: boolean;
  choiceIndex: number;
  effects: ChoiceEffect;
}

interface CongressAction {
  voteRange: [number, number];
  effects: ChoiceEffect;
  isDecree?: boolean;
}

export const CONGRESS_ACTION_POINTS = 3;
const SWING_MARGIN = 5;
const SWING_CANDIDATE_COUNT = 3;

export const CONGRESS_ACTIONS: Record<CongressActionId, CongressAction> = {
  radical: { voteRange: [8, 12], effects: { popularityDelta: -5 } },
  presupuesto: { voteRange: [10, 15], effects: { deficitDelta: 3 } },
  cadena: { voteRange: [3, 7], effects: { mediaCredibilityDelta: -8 } },
  gobernadores: { voteRange: [6, 10], effects: { foreignReservesDelta: -2, popularityDelta: -3 } },
  decreto: {
    voteRange: [0, 0],
    effects: { stabilityDelta: -15, mediaCredibilityDelta: -12, emergencyDecreeDelta: 1 },
    isDecree: true,
  },
};

export const SWING_LEGISLATORS: Record<SwingLegislatorId, ChoiceEffect> = {
  urquiza: { deficitDelta: 2 },
  ferreyra: { deficitDelta: 2, popularityDelta: -3 },
  dominguez: { deficitDelta: 3 },
  paz: { foreignReservesDelta: -4 },
  villegas: { deficitDelta: 2, popularityDelta: 5 },
  rios: { deficitDelta: 2 },
  medina: { marketConfidenceDelta: 5, deficitDelta: 1 },
  torres: { deficitDelta: 3 },
  blanco: { deficitDelta: 2 },
  caceres: { deficitDelta: 1, popularityDelta: 3 },
};

export const LAW_CHOICE = { passed: 0, rejected: 1, decree: 2 } as const;

function mergeEffects(a: ChoiceEffect, b: ChoiceEffect): ChoiceEffect {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]) as Set<keyof ChoiceEffect>;
  const result: ChoiceEffect = {};
  for (const key of keys) {
    result[key] = ((a[key] as number) ?? 0) + ((b[key] as number) ?? 0);
  }
  return result;
}

function pickSwingCandidates(rng: () => number): SwingLegislatorId[] {
  const pool = Object.keys(SWING_LEGISLATORS) as SwingLegislatorId[];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j] as SwingLegislatorId, pool[i] as SwingLegislatorId];
  }
  return pool.slice(0, SWING_CANDIDATE_COUNT);
}

function negotiate(actions: CongressActionId[], rng: () => number) {
  let bonusVotes = 0;
  let effects: ChoiceEffect = {};
  let usedDecree = false;
  let actionPointsLeft = CONGRESS_ACTION_POINTS;

  actions.forEach((id, i) => {
    const action = CONGRESS_ACTIONS[id];
    if (!action) throw new Error(`Unknown congress action: ${id}`);
    if (usedDecree || actionPointsLeft <= 0 || actions.indexOf(id) !== i) {
      throw new Error(`Congress action not allowed: ${id}`);
    }
    effects = mergeEffects(effects, action.effects);
    if (action.isDecree) {
      usedDecree = true;
      return;
    }
    const [min, max] = action.voteRange;
    bonusVotes += min + Math.floor(rng() * (max - min + 1));
    actionPointsLeft -= 1;
  });

  return { bonusVotes, effects, usedDecree, actionPointsLeft };
}

function lobbySwingVotes(
  candidates: SwingLegislatorId[],
  choices: SwingChoice[],
  rng: () => number,
): { netVotes: number; effects: ChoiceEffect } {
  if (choices.length > candidates.length) throw new Error('More swing choices than swing legislators');
  let netVotes = 0;
  let effects: ChoiceEffect = {};
  choices.forEach((choice, i) => {
    if (choice === 'accept') {
      effects = mergeEffects(effects, SWING_LEGISLATORS[candidates[i] as SwingLegislatorId]);
      netVotes += 1;
    } else if (choice === 'refuse') {
      netVotes -= 1;
    } else {
      netVotes += rng() < 0.5 ? 1 : -1;
    }
  });
  return { netVotes, effects };
}

export function resolveCongressSession(state: GameState, decisions: CongressDecisions): CongressOutcome {
  const { congress } = state;
  const rng = createRng(state.seed + state.turn);
  const totalSeats = congress.governmentSeats + congress.oppositionSeats + congress.independentSeats;
  const requiredVotes = Math.floor(totalSeats / 2) + 1;

  const negotiation = negotiate(decisions.actions, rng);
  const independentYesPercent = Math.min(
    100,
    (congress.independentSupportBonus ?? 0) +
      Math.round((negotiation.bonusVotes / Math.max(1, congress.independentSeats)) * 100),
  );
  const votingYes = negotiation.usedDecree
    ? totalSeats
    : congress.governmentSeats + Math.floor((congress.independentSeats * independentYesPercent) / 100);

  const swingTriggered = !negotiation.usedDecree && Math.abs(votingYes - requiredVotes) <= SWING_MARGIN;
  const swingCandidates = swingTriggered ? pickSwingCandidates(rng) : [];
  const swing = lobbySwingVotes(swingCandidates, decisions.swingChoices, rng);

  const finalYes = votingYes + swing.netVotes;
  const passed = negotiation.usedDecree || finalYes >= requiredVotes;
  const choiceIndex = negotiation.usedDecree
    ? LAW_CHOICE.decree
    : passed
      ? LAW_CHOICE.passed
      : LAW_CHOICE.rejected;

  return {
    actionPointsLeft: negotiation.actionPointsLeft,
    bonusVotes: negotiation.bonusVotes,
    usedDecree: negotiation.usedDecree,
    totalSeats,
    requiredVotes,
    independentYesPercent,
    votingYes,
    swingCandidates,
    finalYes,
    passed,
    choiceIndex,
    effects: mergeEffects(negotiation.effects, swing.effects),
  };
}
