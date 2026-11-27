import { createElement, type PropsWithChildren } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const apiGet = vi.hoisted(() => vi.fn());
vi.mock('../../app/routes.js', () => ({ prefetchRoute: vi.fn() }));
vi.mock('../../lib/api.js', () => ({ apiGet }));

const { DAILY_LEADERBOARD, leaderboardQuery, useLeaderboard } = await import('../useLeaderboard.js');
const { PERSISTED_GC_TIME } = await import('../../app/queryClient.js');

describe('leaderboardQuery', () => {
  it('keys the global board as "all"', () => {
    expect(leaderboardQuery().queryKey).toEqual(['leaderboard', 'all']);
  });

  it('keys per-difficulty boards separately', () => {
    expect(leaderboardQuery('hard').queryKey).toEqual(['leaderboard', 'hard']);
  });

  it('requests the daily board with its own key', async () => {
    const client = new QueryClient();
    apiGet.mockResolvedValue([]);
    await client.fetchQuery(leaderboardQuery(DAILY_LEADERBOARD));
    expect(leaderboardQuery(DAILY_LEADERBOARD).queryKey).toEqual(['leaderboard', 'daily']);
    expect(apiGet).toHaveBeenCalledWith('leaderboard?daily=1', { cache: 'no-cache' });
    client.clear();
  });

  it('keeps cached data at least as long as the persisted cache lives', () => {
    expect(leaderboardQuery().gcTime).toBeGreaterThanOrEqual(PERSISTED_GC_TIME);
  });

  it('refetches fresh cached data after a saved run invalidates it, bypassing the HTTP cache', async () => {
    const client = new QueryClient();
    client.setQueryData(['leaderboard', 'all'], [{ id: 'old' }]);
    await client.invalidateQueries({ queryKey: ['leaderboard'] });
    apiGet.mockResolvedValue([{ id: 'new' }]);
    const wrapper = ({ children }: PropsWithChildren) =>
      createElement(QueryClientProvider, { client }, children);
    const { result } = renderHook(() => useLeaderboard(), { wrapper });
    await waitFor(() => expect(result.current.data).toEqual([{ id: 'new' }]));
    expect(apiGet).toHaveBeenCalledWith('leaderboard', { cache: 'no-cache' });
    client.clear();
  });
});
