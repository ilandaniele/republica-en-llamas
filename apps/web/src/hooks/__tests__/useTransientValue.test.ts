import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useTransientValue } from '../useTransientValue.js';

describe('useTransientValue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns to idle after the duration', () => {
    const { result } = renderHook(() => useTransientValue(false));
    act(() => result.current[1](true, 1000));
    expect(result.current[0]).toBe(true);
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current[0]).toBe(false);
  });

  it('restarts the timer when shown again', () => {
    const { result } = renderHook(() => useTransientValue<string | null>(null));
    act(() => result.current[1]('a', 1000));
    act(() => vi.advanceTimersByTime(800));
    act(() => result.current[1]('b', 1000));
    act(() => vi.advanceTimersByTime(800));
    expect(result.current[0]).toBe('b');
  });

  it('hides immediately and cancels the pending timer', () => {
    const { result } = renderHook(() => useTransientValue(false));
    act(() => result.current[1](true, 1000));
    act(() => result.current[2]());
    expect(result.current[0]).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('clears the pending timer on unmount', () => {
    const { result, unmount } = renderHook(() => useTransientValue(false));
    act(() => result.current[1](true, 1000));
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
