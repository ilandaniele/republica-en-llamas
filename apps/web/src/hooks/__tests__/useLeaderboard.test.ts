import { describe, expect, it, vi } from 'vitest';

vi.mock('../../lib/supabase.js', () => ({ supabase: {} }));
vi.mock('../../app/routes.js', () => ({ prefetchRoute: vi.fn() }));

const { leaderboardQuery } = await import('../useLeaderboard.js');
const { PERSISTED_GC_TIME } = await import('../../app/queryClient.js');

describe('leaderboardQuery', () => {
  it('keys the global board as "all"', () => {
    expect(leaderboardQuery().queryKey).toEqual(['leaderboard', 'all']);
  });

  it('keys per-difficulty boards separately', () => {
    expect(leaderboardQuery('hard').queryKey).toEqual(['leaderboard', 'hard']);
  });

  it('keeps cached data at least as long as the persisted cache lives', () => {
    expect(leaderboardQuery().gcTime).toBeGreaterThanOrEqual(PERSISTED_GC_TIME);
  });
});
