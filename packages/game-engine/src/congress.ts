import type { GameState, VoteResult, NegotiationType } from './types.js';
import { NEGOTIATION_CONFIG, TOTAL_SEATS } from './constants.js';
import { clamp } from './utils.js';

export function calculateVote(
  state: GameState,
  _negotiation: NegotiationType | null
): VoteResult {
  const { congress } = state;
  const totalSeats = TOTAL_SEATS;
  const required = Math.floor(totalSeats / 2) + 1;

  // Coalition bonus
  const effectiveGovSeats =
    congress.coalitionTurnsRemaining > 0
      ? congress.governmentSeats + NEGOTIATION_CONFIG.COALITION_BUILDING.governmentSeatsDelta
      : congress.governmentSeats;

  const independentSupport = congress.independentSupportBonus / 100;
  const independentVotes = Math.floor(congress.independentSeats * independentSupport);

  const totalVotes = Math.min(effectiveGovSeats + independentVotes, totalSeats);

  return {
    passed: totalVotes >= required,
    governmentVotes: Math.min(effectiveGovSeats, totalSeats),
    independentVotes,
    totalVotes,
    requiredVotes: required,
  };
}

export function applyNegotiation(
  state: GameState,
  type: NegotiationType
): GameState {
  let s = { ...state };

  switch (type) {
    case 'POLITICAL_DEAL': {
      const cfg = NEGOTIATION_CONFIG.POLITICAL_DEAL;
      s = {
        ...s,
        political: {
          ...s.political,
          popularity: clamp(s.political.popularity + cfg.popularityDelta, 0, 100),
        },
        congress: {
          ...s.congress,
          independentSupportBonus: Math.min(
            100,
            s.congress.independentSupportBonus + cfg.independentSupportBonus
          ),
        },
      };
      break;
    }
    case 'BUDGET_CONCESSION': {
      const cfg = NEGOTIATION_CONFIG.BUDGET_CONCESSION;
      s = {
        ...s,
        economic: {
          ...s.economic,
          publicDeficit: clamp(s.economic.publicDeficit + cfg.deficitDelta, 0, 100),
        },
        congress: {
          ...s.congress,
          independentSupportBonus: Math.min(
            100,
            s.congress.independentSupportBonus + cfg.independentSupportBonus
          ),
        },
      };
      break;
    }
    case 'EMERGENCY_DECREE': {
      const cfg = NEGOTIATION_CONFIG.EMERGENCY_DECREE;
      const newDecrees = s.political.emergencyDecreesUsed + cfg.emergencyDecreeDelta;
      const overThreshold = newDecrees > cfg.instabilityPenaltyThreshold;
      s = {
        ...s,
        political: {
          ...s.political,
          emergencyDecreesUsed: newDecrees,
          socialStability: overThreshold
            ? clamp(
                s.political.socialStability - cfg.instabilityPenalty,
                0,
                100
              )
            : s.political.socialStability,
          mediaCredibility: overThreshold
            ? clamp(
                s.political.mediaCredibility - cfg.credibilityPenalty,
                0,
                100
              )
            : s.political.mediaCredibility,
        },
        congress: {
          ...s.congress,
          lawsPassedThisRun: s.congress.lawsPassedThisRun + 1,
        },
      };
      break;
    }
    case 'COALITION_BUILDING': {
      const cfg = NEGOTIATION_CONFIG.COALITION_BUILDING;
      s = {
        ...s,
        political: {
          ...s.political,
          popularity: clamp(s.political.popularity + cfg.popularityDelta, 0, 100),
          socialStability: clamp(
            s.political.socialStability + cfg.stabilityDelta,
            0,
            100
          ),
        },
        congress: {
          ...s.congress,
          coalitionTurnsRemaining: cfg.durationTurns * 3,
        },
      };
      break;
    }
  }

  return s;
}
