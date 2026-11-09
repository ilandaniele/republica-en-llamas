import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SoundProvider } from '../SoundManager.js';
import { useSounds } from '../../hooks/useSounds.js';

function VoteSounds() {
  const { playVoteTick } = useSounds();
  return (
    <button
      onClick={() => {
        for (let i = 0; i < 32; i++) playVoteTick(i % 2 ? 440 : 180);
      }}
    >
      Vote ticks
    </button>
  );
}

function mockAudio() {
  const nodes: { disconnect: ReturnType<typeof vi.fn>; onended: (() => void) | null }[] = [];
  const context = {
    state: 'running',
    currentTime: 0,
    destination: {},
    close: vi.fn().mockResolvedValue(undefined),
    createGain: vi.fn(() => ({
      connect: vi.fn(),
      disconnect: vi.fn(),
      gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
    })),
    createOscillator: vi.fn(() => {
      const node = {
        connect: vi.fn(),
        disconnect: vi.fn(),
        frequency: { value: 0 },
        start: vi.fn(),
        stop: vi.fn(),
        onended: null as (() => void) | null,
      };
      nodes.push(node);
      return node;
    }),
  };
  const Constructor = vi.fn(function () {
    return context;
  });
  vi.stubGlobal('AudioContext', Constructor);
  return { context, Constructor, nodes };
}

beforeEach(() => localStorage.clear());
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('congressional audio resources', () => {
  it('reuses one context across vote ticks, releases nodes and closes on unmount', () => {
    const { context, Constructor, nodes } = mockAudio();
    const { unmount } = render(
      <SoundProvider>
        <VoteSounds />
      </SoundProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Vote ticks' }));
    fireEvent.click(screen.getByRole('button', { name: 'Vote ticks' }));
    expect(Constructor).toHaveBeenCalledTimes(1);
    expect(context.createOscillator).toHaveBeenCalledTimes(64);
    for (const node of nodes) {
      node.onended?.();
      expect(node.disconnect).toHaveBeenCalledTimes(1);
    }
    for (const result of context.createGain.mock.results)
      expect(result.value.disconnect).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByTitle('Silenciar'));
    fireEvent.click(screen.getByRole('button', { name: 'Vote ticks' }));
    expect(context.createOscillator).toHaveBeenCalledTimes(64);
    unmount();
    expect(context.close).toHaveBeenCalledTimes(1);
  });

  it('never allocates audio when the player starts muted', () => {
    localStorage.setItem('soundEnabled', 'false');
    const { Constructor } = mockAudio();
    render(
      <SoundProvider>
        <VoteSounds />
      </SoundProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Vote ticks' }));
    expect(Constructor).not.toHaveBeenCalled();
  });
});
