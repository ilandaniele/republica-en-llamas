import type { GameState } from '@republica/game-engine';
import type { CasaRosadaMood } from './getCasaRosadaMood.js';
import type { DioramaSituation } from './getDioramaSituation.js';

export type RiotPhase = 'none' | 'cordon' | 'water' | 'dispersal' | 'dialogue' | 'recovery';
export const RIOT_LABELS: Partial<Record<RiotPhase, string>> = {
  cordon: 'CORDÓN PREVENTIVO EN LA PLAZA',
  water: 'DISTURBIOS: HIDRANTE EN LA PLAZA',
  dispersal: 'OPERATIVO DE DISPERSIÓN',
  recovery: 'ASISTENCIA TRAS LOS DISTURBIOS',
  dialogue: 'MESA DE DIÁLOGO EN LA PLAZA',
};
const POLICIES = new Set(['arg_008', 'pol_013', 'cri_social_001', 'cri_social_003', 'hist_corral_002']);
const CLEARANCE = new Set(['arg_008:1', 'cri_social_001:0', 'hist_corral_002:1']);
const DIALOGUE = new Set([
  'arg_008:0',
  'arg_008:2',
  'arg_008:3',
  'pol_013:0',
  'pol_013:2',
  'pol_013:3',
  'cri_social_001:1',
  'cri_social_003:0',
  'hist_corral_002:2',
]);

export interface RiotResponse {
  phase: RiotPhase;
  tearGas: boolean;
  rubberRounds: boolean;
  medical: boolean;
}

function phaseFor(state: GameState, crowd: number): RiotPhase {
  const policy = [...state.history].reverse().find((e) => POLICIES.has(e.cardId));
  if (policy) {
    const age = state.turn - policy.turn;
    const key = `${policy.cardId}:${policy.choiceIndex}`;
    if (age <= 2 && DIALOGUE.has(key)) return 'dialogue';
    if (age <= 2 && CLEARANCE.has(key) && crowd >= 2) return 'dispersal';
    if (age <= 4 && CLEARANCE.has(key)) return 'recovery';
  }
  if (crowd === 3) return 'water';
  return crowd === 2 ? 'cordon' : 'none';
}

export function getRiotResponse(
  state: GameState,
  mood: CasaRosadaMood,
  situation: DioramaSituation,
): RiotResponse {
  const inactive =
    state.isGameOver ||
    mood.ruins ||
    mood.graves ||
    situation.vacant ||
    situation.combat ||
    situation.inauguration;
  const phase = inactive ? 'none' : phaseFor(state, mood.crowd);
  return {
    phase,
    tearGas: phase === 'dispersal',
    rubberRounds: phase === 'dispersal' && mood.crowd === 3,
    medical: phase === 'dispersal' || phase === 'recovery',
  };
}
