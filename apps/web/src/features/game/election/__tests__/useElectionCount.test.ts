import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { COUNT_INTERVAL_MS, useElectionCount } from '../useElectionCount.js';

let reducedMotion = false;
vi.mock('framer-motion', () => ({ useReducedMotion: () => reducedMotion }));
beforeEach(() => {
  reducedMotion = false;
  vi.useFakeTimers();
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('count playback', () => {
  it('pauses, resumes and changes speed without losing the current batch', () => {
    const { result } = renderHook(() => useElectionCount(12));
    act(() => vi.advanceTimersByTime(COUNT_INTERVAL_MS * 2));
    expect(result.current.step).toBe(2);
    act(() => result.current.togglePause());
    act(() => vi.advanceTimersByTime(COUNT_INTERVAL_MS * 4));
    expect(result.current.step).toBe(2);
    expect(vi.getTimerCount()).toBe(0);
    act(() => {
      result.current.setSpeed(2);
      result.current.togglePause();
    });
    expect(vi.getTimerCount()).toBe(1);
    act(() => vi.advanceTimersByTime(COUNT_INTERVAL_MS / 2));
    expect(result.current.step).toBe(3);
    act(() => result.current.finish());
    expect(result.current.step).toBe(12);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('pauses in the background and keeps a manual pause after returning', () => {
    const visibility = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible');
    const { result, unmount } = renderHook(() => useElectionCount(12));
    act(() => vi.advanceTimersByTime(COUNT_INTERVAL_MS));
    visibility.mockReturnValue('hidden');
    act(() => document.dispatchEvent(new Event('visibilitychange')));
    expect(result.current.paused).toBe(true);
    act(() => vi.advanceTimersByTime(5000));
    expect(result.current.step).toBe(1);
    act(() => result.current.togglePause());
    visibility.mockReturnValue('visible');
    act(() => document.dispatchEvent(new Event('visibilitychange')));
    expect(result.current.paused).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
    act(() => result.current.togglePause());
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('does not rewind a final result when the motion preference is toggled', () => {
    const { result, rerender } = renderHook(() => useElectionCount(12));
    act(() => vi.advanceTimersByTime(COUNT_INTERVAL_MS));
    reducedMotion = true;
    rerender();
    expect(result.current.step).toBe(12);
    expect(vi.getTimerCount()).toBe(0);
    reducedMotion = false;
    rerender();
    expect(result.current.step).toBe(12);
    expect(result.current.complete).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
  });
});
