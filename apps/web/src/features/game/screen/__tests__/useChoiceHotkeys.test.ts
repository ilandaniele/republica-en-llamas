import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { drawNextCard, initGame } from '@republica/game-engine';
import { useChoiceHotkeys } from '../useChoiceHotkeys.js';
afterEach(cleanup);

describe('choice keyboard controls', () => {
  it('blocks hidden choices during a count and ignores SVG button targets afterwards', () => {
    const selectChoice = vi.fn();
    const confirmChoice = vi.fn();
    const card = drawNextCard(initGame('normal', 42));
    renderHook(() =>
      useChoiceHotkeys({ card, enabled: true, pendingChoiceIndex: 0, selectChoice, confirmChoice }),
    );
    const scene = document.createElement('section');
    scene.dataset.choicesDisabled = 'true';
    document.body.appendChild(scene);
    act(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' })));
    act(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' })));
    expect(selectChoice).not.toHaveBeenCalled();
    expect(confirmChoice).not.toHaveBeenCalled();
    scene.dataset.choicesDisabled = 'false';
    const province = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    province.setAttribute('role', 'button');
    scene.appendChild(province);
    act(() => province.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true })));
    expect(selectChoice).not.toHaveBeenCalled();
    act(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' })));
    expect(selectChoice).toHaveBeenCalledWith(card.id, 0);
    scene.remove();
  });
  it('selects and confirms choices while preserving native input and button behavior', () => {
    const selectChoice = vi.fn();
    const confirmChoice = vi.fn();
    const card = drawNextCard(initGame('normal', 42));
    renderHook(() =>
      useChoiceHotkeys({ card, enabled: true, pendingChoiceIndex: 0, selectChoice, confirmChoice }),
    );
    act(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: '1' })));
    expect(selectChoice).toHaveBeenCalledWith(card.id, 0);
    act(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' })));
    expect(confirmChoice).toHaveBeenCalledTimes(1);
    for (const tag of ['input', 'textarea', 'select', 'button', 'a']) {
      const element = document.createElement(tag);
      document.body.appendChild(element);
      act(() => element.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true })));
      act(() => element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })));
      element.remove();
    }
    expect(selectChoice).toHaveBeenCalledTimes(1);
    expect(confirmChoice).toHaveBeenCalledTimes(1);
  });

  it('ignores shortcuts while paused, modified or repeated', () => {
    const selectChoice = vi.fn();
    const card = drawNextCard(initGame('normal', 42));
    const { rerender } = renderHook(
      ({ enabled }) =>
        useChoiceHotkeys({ card, enabled, pendingChoiceIndex: null, selectChoice, confirmChoice: vi.fn() }),
      { initialProps: { enabled: false } },
    );
    act(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: '1' })));
    expect(selectChoice).not.toHaveBeenCalled();
    rerender({ enabled: true });
    for (const modifier of [{ ctrlKey: true }, { metaKey: true }, { altKey: true }, { repeat: true }])
      act(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', ...modifier })));
    expect(selectChoice).not.toHaveBeenCalled();
  });
});
