import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { initGame, type GameState } from '@republica/game-engine';
import { CasaRosadaScene } from '../CasaRosadaScene.js';
import { getCasaRosadaMood } from '../getCasaRosadaMood.js';
import { getDioramaSituation } from '../getDioramaSituation.js';
import { getPlazaActivity } from '../getPlazaActivity.js';

vi.mock('framer-motion', () => ({ useReducedMotion: () => false }));

function calmState(): GameState {
  const state = initGame('normal', 42, 'es', undefined, 'macri');
  return { ...state, turn: 8, political: { ...state.political, popularity: 55, socialStability: 75 } };
}

function activity(state: GameState) {
  return getPlazaActivity(state, getCasaRosadaMood(state), getDioramaSituation(state));
}

describe('plaza life pack', () => {
  it('opens the food cart and mixes walking characters in a calm plaza', () => {
    const { container } = render(<CasaRosadaScene state={calmState()} />);
    expect(container.querySelector('[href="/illustrations/cr_food_cart.webp"]')).not.toBeNull();
    expect(container.querySelectorAll('[data-actor="cr_woman_walk"]')).toHaveLength(2);
    expect(container.querySelector('[data-actor="cr_vendor_serve"] .cr-pose-b image')).not.toBeNull();
    expect(container.querySelector('[href="/illustrations/cr_ambulance.webp"]')).toBeNull();
  });

  it('brings press and the presidential motorcade to inauguration', () => {
    const { container } = render(<CasaRosadaScene state={initGame('normal', 42)} />);
    for (const id of ['cr_limousine', 'cr_news_van', 'cr_photographer_a', 'cr_photographer_b']) {
      expect(container.querySelector(`[href="/illustrations/${id}.webp"]`)).not.toBeNull();
    }
    expect(container.querySelector('[href="/illustrations/cr_food_cart.webp"]')).toBeNull();
  });

  it('keeps a peaceful march distinct from a violent disturbance', () => {
    const state = calmState();
    const march = { ...state, political: { ...state.political, socialStability: 50 } };
    expect(activity(march)).toMatchObject({ drummers: true, waterCannon: false, medical: false });
    const { container, rerender } = render(<CasaRosadaScene state={march} />);
    expect(container.querySelectorAll('[data-actor="cr_drummer"]')).toHaveLength(3);
    rerender(
      <CasaRosadaScene state={{ ...state, political: { ...state.political, socialStability: 10 } }} />,
    );
    for (const id of ['cr_ambulance', 'cr_water_cannon', 'cr_barricade_solid'])
      expect(container.querySelector(`[href="/illustrations/${id}.webp"]`)).not.toBeNull();
    expect(container.querySelector('[data-actor="cr_drummer"]')).toBeNull();
  });

  it('responds to medical and public works decisions, then clears the temporary scene', () => {
    const state = calmState();
    const history = [{ turn: 7, cardId: 'party_federal_rutas', choiceIndex: 0, effectsApplied: {} }];
    expect(activity({ ...state, history }).roadworks).toBe(true);
    expect(activity({ ...state, turn: 10, history }).roadworks).toBe(false);
    expect(
      activity({ ...state, history: [{ ...history[0]!, cardId: 'party_peronista_obra', choiceIndex: 2 }] })
        .roadworks,
    ).toBe(false);
    expect(
      activity({ ...state, history: [{ ...history[0]!, cardId: 'new_008', choiceIndex: 1 }] }).roadworks,
    ).toBe(false);
    const medicalHistory = [{ ...history[0]!, cardId: 'soc_004' }];
    expect(activity({ ...state, history: medicalHistory })).toMatchObject({
      medical: true,
      vendors: false,
      roadworks: false,
    });
  });

  it('uses emergency aid during combat and removes all activity after destruction', () => {
    const state = calmState();
    const combat = {
      ...state,
      history: [{ turn: 7, cardId: 'malvinas_003', choiceIndex: 0, effectsApplied: {} }],
    };
    expect(activity(combat)).toMatchObject({
      aidStation: true,
      medical: true,
      waterCannon: false,
      vendors: false,
    });
    const { container, rerender } = render(<CasaRosadaScene state={combat} />);
    expect(container.querySelector('[href="/illustrations/cr_aid_tent.webp"]')).not.toBeNull();
    expect(container.querySelectorAll('[data-actor="cr_medic_walk"]')).toHaveLength(2);
    rerender(<CasaRosadaScene state={combat} outcome="nuclear_annihilation" />);
    expect(container.querySelector('[data-plaza-props] image')).toBeNull();
    expect(container.querySelector('[data-plaza-performers] image')).toBeNull();
  });
});
