import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { initGame, type GameState, type TurnEvent } from '@republica/game-engine';
import { CasaRosadaScene } from '../CasaRosadaScene.js';
import { getDioramaSituation } from '../getDioramaSituation.js';

vi.mock('framer-motion', () => ({ useReducedMotion: () => false }));

function stateWithDecision(cardId: string, choiceIndex: number): GameState {
  const state = initGame('normal', 42, 'es', undefined, 'cristina');
  const event: TurnEvent = { turn: 6, cardId, choiceIndex, effectsApplied: {} };
  return { ...state, turn: 7, history: [event] };
}

describe('animated Casa Rosada pack', () => {
  it('keeps roof flags waving after the ceremony and gives simultaneous scenes separate masks', () => {
    const state = { ...initGame('normal', 42), turn: 5 };
    const { container, rerender } = render(
      <>
        <CasaRosadaScene state={state} />
        <CasaRosadaScene state={state} />
      </>,
    );
    const masks = Array.from(container.querySelectorAll('mask')).map((mask) => mask.id);
    expect(masks).toHaveLength(2);
    expect(new Set(masks).size).toBe(2);
    for (const flag of container.querySelectorAll('[data-roof-flags]')) {
      expect(flag.querySelectorAll('[data-argentine-flag]')).toHaveLength(2);
      expect(flag.querySelector('animateTransform[repeatCount="indefinite"]')).not.toBeNull();
    }
    expect(container.querySelector('[data-inauguration]')).toBeNull();
    rerender(<CasaRosadaScene state={state} outcome="nuclear_annihilation" />);
    expect(container.querySelector('[data-roof-flags]')).toBeNull();
  });

  it('keeps the island stable during unrest and flies away only once during evacuation', () => {
    const state = stateWithDecision('pol_002', 0);
    const { container, rerender } = render(
      <CasaRosadaScene state={{ ...state, political: { ...state.political, socialStability: 10 } }} />,
    );
    expect(container.querySelector('animateTransform[values="0 0;-1 0;1 0;0 1;0 0"]')).toBeNull();
    rerender(<CasaRosadaScene state={state} outcome="impeachment" />);
    const flight = container.querySelector('[data-flight="departure"] animateTransform');
    expect(flight).toHaveAttribute('fill', 'freeze');
    expect(flight).not.toHaveAttribute('repeatCount');
  });

  it.each([
    'milei',
    'massa',
    'bullrich',
    'bregman',
    'schiaretti',
    'larreta',
    'nestor',
    'cristina',
    'macri',
    'del_cano',
    'kicillof',
    'grabois',
  ])('inaugurates %s with a full moving plaza and the selected president', (president) => {
    const state = initGame('normal', 42, 'es', undefined, president);
    const { container } = render(<CasaRosadaScene state={state} />);
    expect(container.querySelector('figure')).toHaveAttribute('data-situation', 'inauguration');
    expect(container.querySelector('[data-plaza-people]')).toHaveAttribute('data-plaza-people', '72');
    expect(container.querySelectorAll('.cr-person-route')).toHaveLength(72);
    expect(container.querySelector(`[href="/illustrations/cr_president_${president}.webp"]`)).not.toBeNull();
    expect(container.querySelector('[data-actor="cr_supporter_cheer"] .cr-pose-b image')).not.toBeNull();
  });

  it('ends the ceremony after the initial turns and skips historical wartime starts', () => {
    const state = { ...initGame('normal', 42), turn: 3 };
    expect(getDioramaSituation(state).inauguration).toBe(false);
    expect(getDioramaSituation(initGame('normal', 42, 'es', 'malvinas_1982'))).toMatchObject({
      inauguration: false,
      britishFleet: true,
      combat: false,
    });
  });

  it('shows the fleet on escalation and landing only after choosing armed conflict', () => {
    expect(getDioramaSituation(stateWithDecision('malvinas_002', 0))).toMatchObject({
      britishFleet: true,
      landing: false,
      combat: false,
    });
    const state = stateWithDecision('malvinas_003', 0);
    const { container, rerender } = render(<CasaRosadaScene state={state} />);
    expect(container.querySelector('figure')).toHaveAttribute('data-situation', 'landing');
    expect(container.querySelectorAll('[data-actor="cr_british_marine"]')).toHaveLength(8);
    expect(container.querySelectorAll('.cr-muzzle')).toHaveLength(3);
    expect(container.querySelector('[href="/illustrations/cr_helicopter_transport.webp"]')).not.toBeNull();
    rerender(<CasaRosadaScene state={stateWithDecision('malvinas_002', 1)} />);
    expect(container.querySelector('[data-british-arrival]')).toBeNull();
    expect(container.querySelector('.cr-muzzle')).toBeNull();
  });

  it('keeps protests free of gunfire and war decisions distinct from diplomacy', () => {
    const state = stateWithDecision('pol_002', 0);
    const { container } = render(
      <CasaRosadaScene state={{ ...state, political: { ...state.political, socialStability: 10 } }} />,
    );
    expect(container.querySelector('[data-actor="cr_protester_run"]')).not.toBeNull();
    expect(container.querySelector('.cr-muzzle')).toBeNull();
    expect(getDioramaSituation(stateWithDecision('guerra_001', 0)).combat).toBe(true);
    expect(getDioramaSituation(stateWithDecision('guerra_001', 1)).combat).toBe(false);
  });

  it('clears living actors after destruction and preserves the empty-plaza ending', () => {
    const state = stateWithDecision('malvinas_003', 0);
    const { container, rerender } = render(<CasaRosadaScene state={state} outcome="nuclear_annihilation" />);
    expect(container.querySelector('[data-plaza-people]')).toBeNull();
    expect(container.querySelector('.cr-muzzle')).toBeNull();
    expect(container.querySelector('[data-inauguration]')).toBeNull();
    rerender(<CasaRosadaScene state={state} outcome="deflation_spiral" />);
    expect(container.querySelector('[data-plaza-people]')).toBeNull();
  });
});
