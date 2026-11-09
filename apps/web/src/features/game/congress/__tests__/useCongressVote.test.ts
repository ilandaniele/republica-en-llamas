import { act, renderHook, cleanup } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useCongressVote } from '../useCongressVote.js';
import { computeSeats } from '../computeSeats.js';

const flags = vi.hoisted(() => ({ reduced: false, tick: vi.fn() }));
vi.mock('framer-motion', () => ({ useReducedMotion: () => flags.reduced }));
vi.mock('../../../../hooks/useSounds.js', () => ({ useSounds: () => ({ playVoteTick: flags.tick }) }));

beforeEach(() => {
  vi.useFakeTimers();
  flags.reduced = false;
  flags.tick.mockClear();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('Congress vote animation', () => {
  it.each([
    { governmentSeats: 260, oppositionSeats: 210, independentSeats: 68 },
    { governmentSeats: 0, oppositionSeats: 0, independentSeats: 538 },
    { governmentSeats: 538, oppositionSeats: 0, independentSeats: 0 },
  ])('finishes a full chamber within three seconds using one timer: %j', (counts) => {
    const seats = computeSeats(counts);
    const done = vi.fn();
    const { result } = renderHook(() => useCongressVote(seats, 50));
    act(() => result.current.startVoting(done));
    expect(vi.getTimerCount()).toBe(1);
    act(() => vi.advanceTimersByTime(1200));
    expect(result.current.seatVotes).toContain('pending');
    expect(result.current.seatVotes.some((vote) => vote !== 'pending')).toBe(true);
    act(() => vi.advanceTimersByTime(1800));
    expect(result.current.seatVotes).toHaveLength(257);
    expect(result.current.seatVotes).not.toContain('pending');
    expect(result.current.seatVotes).not.toContain('abstain');
    expect(done).toHaveBeenCalledTimes(1);
    expect(flags.tick.mock.calls.length).toBeLessThan(32);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('completes immediately with reduced motion and plays no ticks', () => {
    flags.reduced = true;
    const seats = computeSeats({ governmentSeats: 200, oppositionSeats: 200, independentSeats: 138 });
    const done = vi.fn();
    const { result } = renderHook(() => useCongressVote(seats, 100));
    act(() => result.current.startVoting(done));
    expect(done).toHaveBeenCalledTimes(1);
    expect(result.current.seatVotes).not.toContain('pending');
    expect(flags.tick).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('ignores repeated starts, allows skipping once and resets a subsequent count', () => {
    const seats = computeSeats({ governmentSeats: 200, oppositionSeats: 200, independentSeats: 138 });
    const done = vi.fn();
    const duplicate = vi.fn();
    const { result } = renderHook(() => useCongressVote(seats, 20));
    act(() => {
      result.current.startVoting(done);
      result.current.startVoting(duplicate);
    });
    act(() => vi.advanceTimersByTime(500));
    act(() => {
      result.current.finishVoting();
      result.current.finishVoting();
    });
    act(() => vi.advanceTimersByTime(5000));
    expect(done).toHaveBeenCalledTimes(1);
    expect(duplicate).not.toHaveBeenCalled();
    expect(result.current.seatVotes).not.toContain('pending');
    act(() => result.current.startVoting(duplicate));
    expect(result.current.seatVotes.every((vote) => vote === 'pending')).toBe(true);
    act(() => result.current.finishVoting());
    expect(duplicate).toHaveBeenCalledTimes(1);
  });

  it('cancels pending work when leaving the session', () => {
    const seats = computeSeats({ governmentSeats: 200, oppositionSeats: 200, independentSeats: 138 });
    const done = vi.fn();
    const { result, unmount } = renderHook(() => useCongressVote(seats, 50));
    act(() => result.current.startVoting(done));
    unmount();
    act(() => vi.advanceTimersByTime(5000));
    expect(done).not.toHaveBeenCalled();
    expect(flags.tick).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });
});
