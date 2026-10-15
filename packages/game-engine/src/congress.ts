import type { GameState, VoteResult, NegotiationType } from './types.js';
import { NEGOTIATION_CONFIG } from './constants.js';
import { clamp, createRng } from './utils.js';

export function calculateVote(
  state: GameState,
  _negotiation: NegotiationType | null,
  lawId?: string,
): VoteResult {
  const { congress, political } = state;
  const requiredVotes = 128;

  // Seeded variance: each session has different independent turnout (±4 votes)
  const rng = createRng(state.seed + state.turn * 13);
  const variance = Math.floor((rng() - 0.5) * 8);

  // Coalition bonus
  const baseGovSeats =
    congress.coalitionTurnsRemaining > 0
      ? congress.governmentSeats + NEGOTIATION_CONFIG.COALITION_BUILDING.governmentSeatsDelta
      : congress.governmentSeats;

  // Government defections — controversial laws lose 1-3 gov votes (10% chance)
  const isControversial = lawId ? /reform|ajuste|veto|recorte/i.test(lawId) : false;
  let defectionCount = 0;
  if (isControversial && rng() < 0.1) {
    defectionCount = Math.floor(rng() * 3) + 1;
  }
  const effectiveGovSeats = Math.max(0, baseGovSeats - defectionCount);

  // Independent support formula
  let independentSupport = 0.3;
  if (political.popularity > 60) independentSupport += 0.2;
  if (congress.independentSupportBonus >= 30) {
    independentSupport += 0.4;
  } else if (congress.independentSupportBonus >= 20) {
    independentSupport += 0.3;
  } else if (congress.independentSupportBonus > 0) {
    independentSupport += congress.independentSupportBonus / 100;
  }
  if (political.emergencyDecreesUsed > 2) independentSupport -= 0.2;
  independentSupport = Math.max(0, Math.min(1, independentSupport));

  // Abstentions — 15-35% of independents don't show up
  const abstentionCount = Math.round(congress.independentSeats * (0.15 + rng() * 0.2));
  const votingIndependents = Math.max(0, congress.independentSeats - abstentionCount);
  const independentVotes = clamp(
    Math.round(votingIndependents * independentSupport) + variance,
    0,
    votingIndependents,
  );

  let totalGovVotes = effectiveGovSeats + independentVotes;

  // Opposition bribery — if opposition is large, they can flip 1-4 independent votes (25% chance)
  let bribeOccurred = false;
  let bribedVotes = 0;
  if (congress.oppositionSeats > 140 && rng() < 0.25) {
    bribedVotes = Math.floor(rng() * 4) + 1;
    totalGovVotes = Math.max(0, totalGovVotes - bribedVotes);
    bribeOccurred = true;
  }

  return {
    passed: totalGovVotes >= requiredVotes,
    governmentVotes: effectiveGovSeats,
    independentVotes,
    totalVotes: totalGovVotes,
    requiredVotes,
    bribeOccurred,
    bribedVotes,
    abstentionCount,
    defectionCount,
  };
}

/** Determines presidential election outcome based on current game state. */
export function calculateElectionResult(state: GameState): { won: boolean; marginPercent: number } {
  const { political, economic } = state;
  const won = political.popularity > 45 && economic.marketConfidence > 35;
  const popularityMargin = (political.popularity - 45) / 55;
  const economyBonus = ((economic.marketConfidence - 35) / 65) * 0.3;
  const marginPercent = Math.round(clamp((popularityMargin + economyBonus) * 100, -50, 50));
  return { won, marginPercent };
}

function addIndependentSupport(congress: GameState['congress'], bonus: number): GameState['congress'] {
  return { ...congress, independentSupportBonus: Math.min(100, congress.independentSupportBonus + bonus) };
}

function politicalDeal(s: GameState): GameState {
  const cfg = NEGOTIATION_CONFIG.POLITICAL_DEAL;
  return {
    ...s,
    political: { ...s.political, popularity: clamp(s.political.popularity + cfg.popularityDelta, 0, 100) },
    congress: addIndependentSupport(s.congress, cfg.independentSupportBonus),
  };
}

function budgetConcession(s: GameState): GameState {
  const cfg = NEGOTIATION_CONFIG.BUDGET_CONCESSION;
  return {
    ...s,
    economic: { ...s.economic, publicDeficit: clamp(s.economic.publicDeficit + cfg.deficitDelta, 0, 100) },
    congress: addIndependentSupport(s.congress, cfg.independentSupportBonus),
  };
}

function emergencyDecree(s: GameState): GameState {
  const cfg = NEGOTIATION_CONFIG.EMERGENCY_DECREE;
  const newDecrees = s.political.emergencyDecreesUsed + cfg.emergencyDecreeDelta;
  const overThreshold = newDecrees > cfg.instabilityPenaltyThreshold;
  return {
    ...s,
    political: {
      ...s.political,
      emergencyDecreesUsed: newDecrees,
      socialStability: overThreshold
        ? clamp(s.political.socialStability - cfg.instabilityPenalty, 0, 100)
        : s.political.socialStability,
      mediaCredibility: overThreshold
        ? clamp(s.political.mediaCredibility - cfg.credibilityPenalty, 0, 100)
        : s.political.mediaCredibility,
    },
    congress: { ...s.congress, lawsPassedThisRun: s.congress.lawsPassedThisRun + 1 },
  };
}

function coalitionBuilding(s: GameState): GameState {
  const cfg = NEGOTIATION_CONFIG.COALITION_BUILDING;
  return {
    ...s,
    political: {
      ...s.political,
      popularity: clamp(s.political.popularity + cfg.popularityDelta, 0, 100),
      socialStability: clamp(s.political.socialStability + cfg.stabilityDelta, 0, 100),
    },
    congress: { ...s.congress, coalitionTurnsRemaining: cfg.durationTurns * 3 },
  };
}

// Partial: replayed runs may carry an unknown type from the client, which is a no-op.
const NEGOTIATIONS: Partial<Record<NegotiationType, (s: GameState) => GameState>> = {
  POLITICAL_DEAL: politicalDeal,
  BUDGET_CONCESSION: budgetConcession,
  EMERGENCY_DECREE: emergencyDecree,
  COALITION_BUILDING: coalitionBuilding,
};

export function applyNegotiation(state: GameState, type: NegotiationType): GameState {
  const negotiate = NEGOTIATIONS[type];
  return negotiate ? negotiate({ ...state }) : { ...state };
}
