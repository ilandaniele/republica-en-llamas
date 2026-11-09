import type { GameState } from '@republica/game-engine';
import type { CasaRosadaMood } from './getCasaRosadaMood.js';
import type { DioramaSituation } from './getDioramaSituation.js';
import { getRiotResponse } from './getRiotResponse.js';

export interface PlazaActivity {
  vendors: boolean;
  press: boolean;
  drummers: boolean;
  medical: boolean;
  aidStation: boolean;
  roadworks: boolean;
  waterCannon: boolean;
  waterSpray: boolean;
  motorcade: boolean;
  barricade: boolean;
}

const MEDICAL_EVENTS = ['soc_004', 'scn_004', 'new_010'];

function recentEvent(state: GameState, ids: string[]): boolean {
  return state.history.some((event) => state.turn - event.turn <= 2 && ids.includes(event.cardId));
}

function recentWorks(state: GameState): boolean {
  return state.history.some((event) => {
    if (state.turn - event.turn > 2) return false;
    if (event.cardId === 'party_peronista_obra') return event.choiceIndex !== 2;
    if (event.cardId === 'new_008') return event.choiceIndex === 0 || event.choiceIndex === 2;
    return event.cardId === 'party_federal_rutas';
  });
}

function crowdActivity(mood: CasaRosadaMood, situation: DioramaSituation, medical: boolean) {
  return {
    drummers: !medical && mood.crowd > 0 && mood.crowd < 3,
    waterCannon: !situation.combat && mood.crowd >= 2,
    waterSpray: !situation.combat && mood.crowd === 3,
    barricade: mood.crowd === 3,
  };
}

export function getPlazaActivity(
  state: GameState,
  mood: CasaRosadaMood,
  situation: DioramaSituation,
): PlazaActivity {
  const empty = mood.ruins || mood.graves || situation.vacant;
  if (empty)
    return {
      vendors: false,
      press: false,
      drummers: false,
      medical: false,
      aidStation: false,
      roadworks: false,
      waterCannon: false,
      waterSpray: false,
      motorcade: false,
      barricade: false,
    };
  const riot = getRiotResponse(state, mood, situation);
  const medical = situation.combat || mood.fire || riot.medical || recentEvent(state, MEDICAL_EVENTS);
  const peaceful = !medical && !situation.inauguration && mood.crowd < 2;
  return {
    vendors: peaceful && mood.sky === 'day',
    press: situation.inauguration || state.political.mediaCredibility < 30,
    medical,
    aidStation: medical && (situation.combat || riot.medical),
    roadworks: peaceful && recentWorks(state),
    motorcade: situation.inauguration,
    ...crowdActivity(mood, situation, medical),
  };
}
