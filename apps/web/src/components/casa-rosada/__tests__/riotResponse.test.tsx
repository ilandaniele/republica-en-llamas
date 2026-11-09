import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { initGame, type GameState } from '@republica/game-engine';
import { getCasaRosadaMood } from '../getCasaRosadaMood.js';
import { getDioramaSituation } from '../getDioramaSituation.js';
import { getRiotResponse } from '../getRiotResponse.js';
import { CasaRosadaScene } from '../CasaRosadaScene.js';

vi.mock('framer-motion', () => ({ useReducedMotion: () => false }));
function state(stability: number, cardId = 'arg_008', choiceIndex = 1): GameState {
  const initial = initGame('normal', 42);
  return {
    ...initial,
    turn: 8,
    political: { ...initial.political, socialStability: stability },
    history: [{ turn: 7, cardId, choiceIndex, effectsApplied: {} }],
  };
}
function response(s: GameState) {
  return getRiotResponse(s, getCasaRosadaMood(s), getDioramaSituation(s));
}
describe('riot response scenarios', () => {
  it('uses gas for a clearance and rubber rounds only at the severe unrest level', () => {
    expect(response(state(35))).toMatchObject({ phase: 'dispersal', tearGas: true, rubberRounds: false });
    expect(response(state(10))).toMatchObject({ phase: 'dispersal', tearGas: true, rubberRounds: true });
  });
  it('does not turn low stability or police reinforcement into automatic gunfire', () => {
    expect(response(state(10, 'pol_013', 1))).toMatchObject({
      phase: 'water',
      tearGas: false,
      rubberRounds: false,
    });
    expect(response({ ...state(35), history: [] }).phase).toBe('cordon');
    expect(response({ ...state(70), history: [] }).phase).toBe('none');
  });
  it('stops force immediately after a newer dialogue choice', () => {
    const s = state(10);
    s.history = [...s.history, { turn: 8, cardId: 'arg_008', choiceIndex: 2, effectsApplied: {} }];
    expect(response(s)).toMatchObject({ phase: 'dialogue', tearGas: false, rubberRounds: false });
  });
  it('switches to recovery and expires the temporary operation', () => {
    expect(response({ ...state(35), turn: 10 })).toMatchObject({
      phase: 'recovery',
      medical: true,
      tearGas: false,
    });
    expect(response({ ...state(35), turn: 12 })).toMatchObject({ phase: 'cordon', medical: false });
  });
  it('keeps wartime combat and game over separate', () => {
    const s = state(10);
    expect(response({ ...s, isGameOver: true }).phase).toBe('none');
    expect(
      response({
        ...s,
        history: [...s.history, { turn: 7, cardId: 'guerra_001', choiceIndex: 0, effectsApplied: {} }],
      }).phase,
    ).toBe('none');
  });
  it('renders recoil, animated gas, rubber rounds and aid, then clears them on dialogue', () => {
    const { container, rerender } = render(<CasaRosadaScene state={state(10)} />);
    expect(container.querySelectorAll('[data-actor="cr_riot_officer"]')).toHaveLength(3);
    for (const effect of ['tear-gas', 'rubber-rounds'])
      expect(container.querySelector(`[data-effect="${effect}"]`)).not.toBeNull();
    expect(container.querySelector('[href="/illustrations/cr_aid_tent.webp"]')).not.toBeNull();
    expect(container.querySelector('.cr-muzzle')).toBeNull();
    rerender(<CasaRosadaScene state={state(10, 'arg_008', 2)} />);
    expect(container.querySelector('[data-effect="tear-gas"]')).toBeNull();
    expect(container.querySelector('[data-dialogue]')).not.toBeNull();
  });
});
