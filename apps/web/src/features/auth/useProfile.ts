import { queryOptions, useQuery } from '@tanstack/react-query';
import { apiGet, isOfflineMode } from '../../lib/api.js';
import { fetchRunHistory } from '../../lib/runHistory.js';
import type { RunSummary } from '../../lib/runHistory.js';

export type RecentRun = Pick<
  RunSummary,
  'id' | 'score' | 'turns_survived' | 'is_win' | 'difficulty' | 'created_at'
>;

const RECENT_RUNS_LIMIT = 10;

async function fetchProfileUsername(): Promise<string | null> {
  return (await apiGet<{ username: string | null }>('profile')).username;
}

async function fetchRecentRuns(): Promise<{ runs: RecentRun[]; total: number }> {
  const { runs, total } = await fetchRunHistory();
  return { runs: runs.slice(0, RECENT_RUNS_LIMIT), total };
}

export function profileUsernameQuery(userId: string | undefined) {
  return queryOptions({
    queryKey: ['profile-username', userId],
    queryFn: fetchProfileUsername,
    enabled: !!userId && !isOfflineMode,
  });
}

export function recentRunsQuery(userId: string | undefined) {
  return queryOptions({
    queryKey: ['recent-runs', userId],
    queryFn: fetchRecentRuns,
    enabled: !!userId && !isOfflineMode,
  });
}

export function useProfileUsername(userId: string | undefined) {
  return useQuery(profileUsernameQuery(userId));
}

export function useRecentRuns(userId: string | undefined) {
  return useQuery(recentRunsQuery(userId));
}
