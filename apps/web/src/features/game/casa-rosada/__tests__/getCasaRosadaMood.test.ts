import { describe, expect, it } from 'vitest';
import { initGame, type GameState } from '@republica/game-engine';
import { getCasaRosadaMood } from '../getCasaRosadaMood.js';

function withState(political: Partial<GameState['political']>, extra: Partial<GameState> = {}): GameState {
  const state = initGame('normal', 42);
  return { ...state, ...extra, political: { ...state.political, ...political } };
}

function crisis(type: GameState['activeCrises'][number]['type']): GameState['activeCrises'][number] {
  return { type, startTurn: 1, turnsActive: 1, turnsToResolve: 3, resolved: false };
}

describe('getCasaRosadaMood', () => {
  it('shows a quiet daytime plaza when the country is calm', () => {
    const mood = getCasaRosadaMood(withState({ popularity: 55, socialStability: 65 }));
    expect(mood).toMatchObject({
      sky: 'day',
      crowd: 0,
      fire: false,
      helicopter: false,
      label: 'PLAZA TRANQUILA',
    });
  });

  it('celebrates when the president is popular and the country is stable', () => {
    expect(getCasaRosadaMood(withState({ popularity: 80, socialStability: 70 })).celebration).toBe(true);
  });

  it('fills the plaza with a cacerolazo and police as stability drops', () => {
    const mood = getCasaRosadaMood(withState({ popularity: 40, socialStability: 35 }));
    expect(mood).toMatchObject({ crowd: 2, police: true, sky: 'dusk', label: 'CACEROLAZO' });
  });

  it('sets the plaza on fire during social unrest', () => {
    const mood = getCasaRosadaMood(
      withState({ socialStability: 60 }, { activeCrises: [crisis('socialUnrest')] }),
    );
    expect(mood).toMatchObject({ crowd: 3, fire: true, sky: 'night' });
  });

  it('lands the helicopter during an impeachment attempt', () => {
    const mood = getCasaRosadaMood(withState({}, { activeCrises: [crisis('impeachmentAttempt')] }));
    expect(mood).toMatchObject({ helicopter: true, label: 'HELICÓPTERO EN LA TERRAZA' });
  });

  it('rains dollars when inflation runs high', () => {
    const state = withState({ popularity: 55, socialStability: 65 });
    const mood = getCasaRosadaMood({ ...state, economic: { ...state.economic, inflation: 90 } });
    expect(mood).toMatchObject({ dollarRain: true, label: 'CORRIDA CAMBIARIA' });
  });
});
