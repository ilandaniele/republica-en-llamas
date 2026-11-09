import type { GameOverReason, GameState } from '@republica/game-engine';

export interface DioramaSituation {
  vacant: boolean;
  inauguration: boolean;
  britishFleet: boolean;
  landing: boolean;
  combat: boolean;
}

function getBritishSituation(state: GameState) {
  const lastMalvinas = [...state.history].reverse().find((event) => event.cardId.startsWith('malvinas_'));
  const britishCombat = lastMalvinas?.cardId === 'malvinas_003' && lastMalvinas.choiceIndex === 0;
  const britishEscalation = lastMalvinas?.cardId === 'malvinas_002' && lastMalvinas.choiceIndex === 0;
  const withdrawn = lastMalvinas !== undefined && !britishCombat && !britishEscalation;
  const fleet =
    britishCombat || britishEscalation || (state.activeScenario === 'malvinas_1982' && !withdrawn);
  return { fleet, britishCombat };
}

export function getDioramaSituation(state: GameState, outcome?: GameOverReason): DioramaSituation {
  const { fleet, britishCombat } = getBritishSituation(state);
  const lastWar = [...state.history].reverse().find((event) => event.cardId.startsWith('guerra_'));
  const worldCombat = lastWar?.cardId === 'guerra_001' && lastWar.choiceIndex === 0;
  const ended = outcome !== undefined || state.isGameOver;
  return {
    vacant: outcome === 'deflation_spiral',
    inauguration:
      !ended && !state.activeScenario && state.turn <= 2 && state.activeCrises.every((c) => c.resolved),
    britishFleet: (!ended && fleet) || outcome === 'military_defeat',
    landing: !ended && britishCombat,
    combat: !ended && (britishCombat || worldCombat),
  };
}
