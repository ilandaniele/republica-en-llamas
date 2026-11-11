import type { PropsWithChildren } from 'react';
import { act, cleanup, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { RunConfig } from '@republica/game-engine';

const backend = vi.hoisted(() => ({ isOfflineMode: false, apiSend: vi.fn() }));
vi.mock('../../../lib/api.js', () => backend);
vi.mock('../../../lib/playtest.js', () => ({ isPlaytestMode: false }));
import { useSaveRun } from '../useSaveRun.js';

function setup() {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  for (const key of ['leaderboard', 'run-history', 'recent-runs', 'profile-username'])
    client.setQueryData([key, 'test'], { value: 'cached' });
  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={client}>
      <>{children}</>
    </QueryClientProvider>
  );
  return { client, ...renderHook(() => useSaveRun(), { wrapper }) };
}

const input = {
  ticketId: 'ticket',
  config: { difficulty: 'normal', seed: 42 } satisfies RunConfig,
  decisions: [],
};

beforeEach(() => {
  vi.clearAllMocks();
  backend.isOfflineMode = false;
});
afterEach(cleanup);

describe('saved run cache consistency', () => {
  it.each([false, true])(
    'refreshes affected data after success, including duplicate=%s',
    async (duplicate) => {
      backend.apiSend.mockResolvedValue({ id: duplicate ? null : 'run', score: 100, duplicate });
      const { client, result } = setup();
      await act(async () => {
        await result.current.mutateAsync(input);
      });
      for (const key of ['leaderboard', 'run-history', 'recent-runs'])
        expect(client.getQueryState([key, 'test'])?.isInvalidated).toBe(true);
      expect(client.getQueryState(['profile-username', 'test'])?.isInvalidated).toBe(false);
      client.clear();
    },
  );

  it('keeps cached data when saving fails', async () => {
    backend.apiSend.mockRejectedValue(new Error('offline'));
    const { client, result } = setup();
    await act(async () => {
      await expect(result.current.mutateAsync(input)).rejects.toThrow('offline');
    });
    expect(client.getQueryState(['run-history', 'test'])?.isInvalidated).toBe(false);
    client.clear();
  });

  it.each(['offline', 'career'])('skips remote saves and invalidation for %s runs', async (mode) => {
    backend.isOfflineMode = mode === 'offline';
    const { client, result } = setup();
    const config: RunConfig = mode === 'career' ? { ...input.config, careerStart: 'mayor' } : input.config;
    await act(async () => {
      expect(await result.current.mutateAsync({ ...input, config })).toBeNull();
    });
    expect(backend.apiSend).not.toHaveBeenCalled();
    expect(client.getQueryState(['run-history', 'test'])?.isInvalidated).toBe(false);
    client.clear();
  });
});
