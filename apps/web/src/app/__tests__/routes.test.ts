import { afterEach, describe, expect, it, vi } from 'vitest';
import { prefetchRoute, prefetchRoutesWhenIdle, routeLoaders } from '../routes.js';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('optional route prefetch', () => {
  it('does not create an unhandled rejection when a speculative download fails', async () => {
    const loader = vi.spyOn(routeLoaders, 'home').mockRejectedValue(new Error('network unavailable'));
    expect(prefetchRoute('home')).toBeUndefined();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(loader).toHaveBeenCalledOnce();
  });

  it('cancels fallback work when the app unmounts', () => {
    vi.useFakeTimers();
    const loader = vi.spyOn(routeLoaders, 'home');
    const cancel = prefetchRoutesWhenIdle(['home']);
    cancel();
    vi.advanceTimersByTime(2000);
    expect(loader).not.toHaveBeenCalled();
  });

  it('cancels scheduled idle work', () => {
    const request = vi.fn(() => 7);
    const cancel = vi.fn();
    vi.stubGlobal('requestIdleCallback', request);
    vi.stubGlobal('cancelIdleCallback', cancel);
    prefetchRoutesWhenIdle(['home'])();
    expect(request).toHaveBeenCalledOnce();
    expect(cancel).toHaveBeenCalledWith(7);
  });
});
