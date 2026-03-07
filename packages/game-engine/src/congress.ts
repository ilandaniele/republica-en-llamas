import type { GameState, VoteResult, NegotiationType } from './types.js';
import { NEGOTIATION_CONFIG, TOTAL_SEATS } from './constants.js';
import { clamp } from './utils.js';

export function calculateVote(
  state: GameState,
  _negotiation: NegotiationType | null
): VoteResult {
  const { congress, political } = state;
  const requiredVotes = 128;

  // Coalition bonus (same as before)
  const effectiveGovSeats =
    congress.coalitionTurnsRemaining > 0
      ? congress.governmentSeats + NEGOTIATION_CONFIG.COALITION_BUILDING.governmentSeatsDelta
      : congress.governmentSeats;

  // New independent support formula from patch spec
  let independentSupport = 0.3;
  if (political.popularity > 60) independentSupport += 0.2;
  // Use independentSupportBonus as proxy for last action type:
  //   BUDGET_CONCESSION adds 30 bonus → treat as 'budget' (+0.4)
  //   POLITICAL_DEAL adds 20 bonus → treat as 'deal' (+0.3)
  if (congress.independentSupportBonus >= 30) {
    independentSupport += 0.4; // budget concession
  } else if (congress.independentSupportBonus >= 20) {
    independentSupport += 0.3; // political deal
  } else if (congress.independentSupportBonus > 0) {
    independentSupport += congress.independentSupportBonus / 100;
  }
  if (political.emergencyDecreesUsed > 2) independentSupport -= 0.2;
  independentSupport = Math.max(0, Math.min(1, independentSupport));

  const independentVotes = Math.round(35 * independentSupport);
  const totalGovVotes = effectiveGovSeats + independentVotes;

  return {
    passed: totalGovVotes >= requiredVotes,
    governmentVotes: effectiveGovSeats,
    independentVotes,
    totalVotes: totalGovVotes,
    requiredVotes,
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
