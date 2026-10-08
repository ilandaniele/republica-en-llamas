import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const posthog = { init: vi.fn(), capture: vi.fn(), getFeatureFlag: vi.fn() };
vi.mock('posthog-js', () => ({ default: posthog }));

async function loadAnalytics() {
  vi.resetModules();
  return import('../analytics.js');
}

describe('analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('queues events sent before posthog loads and flushes them after init', async () => {
    vi.stubEnv('VITE_POSTHOG_KEY', 'test-key');
    const analytics = await loadAnalytics();

    analytics.trackGameStarted({ difficulty: 'normal', president: 'p1', mode: 'classic' });
    expect(posthog.capture).not.toHaveBeenCalled();

    analytics.initAnalytics();
    await vi.waitFor(() => expect(posthog.capture).toHaveBeenCalledOnce());
    expect(posthog.capture).toHaveBeenCalledWith('game_started', {
      difficulty: 'normal',
      president: 'p1',
      mode: 'classic',
    });
  });

  it('does nothing when no PostHog key is configured', async () => {
    vi.stubEnv('VITE_POSTHOG_KEY', '');
    const analytics = await loadAnalytics();

    analytics.initAnalytics();
    analytics.trackGameStarted({ difficulty: 'normal', president: 'p1', mode: 'classic' });

    expect(posthog.init).not.toHaveBeenCalled();
    expect(analytics.getFeatureFlag('paywall_timing')).toBeUndefined();
  });
});
