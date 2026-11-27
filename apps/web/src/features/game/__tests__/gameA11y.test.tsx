import { act, cleanup, fireEvent, render, renderHook, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LazyMotion, domAnimation } from 'framer-motion';
import type { ReactNode } from 'react';
import { drawNextCard, initGame } from '@republica/game-engine';
import type { EventCard } from '@republica/game-engine';
import { TurnTransitionScreen } from '../TurnTransitionScreen.js';
import { DecisionDiary } from '../DecisionDiary.js';
import { CrisisAlert } from '../CrisisAlert.js';
import { MilestoneToast } from '../screen/GameOverlays.js';
import { useChoiceHotkeys } from '../screen/useChoiceHotkeys.js';
import { useCrisisCountdown } from '../screen/useCrisisCountdown.js';
import { useGameStore } from '../../../stores/gameStore.js';
import { usePreferencesStore } from '../../../stores/preferencesStore.js';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  usePreferencesStore.setState({ hotkeysEnabled: true, extendedTime: false });
  useGameStore.setState({ gameState: null });
});

const timedCard = (category: EventCard['category']) => ({ id: 'c1', category }) as EventCard;

const withMotion = (ui: ReactNode) => render(<LazyMotion features={domAnimation}>{ui}</LazyMotion>);

const transition = { fromTurn: 1, toTurn: 2, statDeltas: [], headline: 'Titular', hookText: 'Gancho' };

describe('TurnTransitionScreen', () => {
  it('is a labelled dialog that focuses CONTINUAR', () => {
    withMotion(<TurnTransitionScreen data={transition} onDismiss={vi.fn()} />);
    expect(screen.getByRole('dialog', { name: /TURNO 1/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /CONTINUAR/ })).toHaveFocus();
  });

  it('does not dismiss when Enter or Space is pressed on another control', () => {
    const onDismiss = vi.fn();
    const other = document.createElement('button');
    document.body.appendChild(other);
    withMotion(<TurnTransitionScreen data={transition} onDismiss={onDismiss} />);
    other.focus();
    fireEvent.keyDown(other, { key: 'Enter' });
    fireEvent.keyDown(window, { key: ' ' });
    expect(onDismiss).not.toHaveBeenCalled();
    other.remove();
  });
});

describe('DecisionDiary', () => {
  it('has a labelled dialog, a named close button and closes on Escape', () => {
    useGameStore.setState({ gameState: initGame('normal', 42) });
    const onClose = vi.fn();
    withMotion(<DecisionDiary isOpen onClose={onClose} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAccessibleName();
    expect(screen.getByRole('button', { name: 'Cerrar diario' })).toBeInTheDocument();
    fireEvent.keyDown(dialog, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});

describe('game live regions', () => {
  it('announces crises as alerts and milestones as status', () => {
    const crisis = { type: 'debtCrisis', turnsRemaining: 2, severity: 1 } as never;
    withMotion(
      <>
        <CrisisAlert crises={[crisis]} />
        <MilestoneToast message="Hito alcanzado" />
      </>,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Hito alcanzado');
  });
});

describe('game preferences', () => {
  it('skips choice hotkeys when the preference is off', () => {
    usePreferencesStore.setState({ hotkeysEnabled: false });
    const selectChoice = vi.fn();
    const card = drawNextCard(initGame('normal', 42));
    renderHook(() =>
      useChoiceHotkeys({
        card,
        enabled: true,
        pendingChoiceIndex: null,
        selectChoice,
        confirmChoice: vi.fn(),
      }),
    );
    act(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: '1' })));
    expect(selectChoice).not.toHaveBeenCalled();
  });

  it('gives 90 seconds per Crisis Express turn with extended time', () => {
    usePreferencesStore.setState({ extendedTime: true });
    const { result } = renderHook(() =>
      useCrisisCountdown({
        card: timedCard('economic'),
        isCrisisExpress: true,
        paused: true,
        onTimeout: vi.fn(),
      }),
    );
    expect(result.current).toBe(90);
  });

  it('times crisis cards in a normal run and leaves the rest untimed', () => {
    useGameStore.setState({ gameState: initGame('normal', 42, 'es') });
    const countdown = (category: EventCard['category']) =>
      renderHook(() =>
        useCrisisCountdown({
          card: timedCard(category),
          isCrisisExpress: false,
          paused: true,
          onTimeout: vi.fn(),
        }),
      ).result.current;
    expect(countdown('crisis')).toBe(45);
    expect(countdown('political')).toBeNull();
  });
});
