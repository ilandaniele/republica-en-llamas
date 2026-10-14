import { queryOptions, useQuery } from '@tanstack/react-query';
import { supabase, isOfflineMode } from '../../lib/supabase.js';
import type { Tables } from '../../lib/supabase.js';

export type RecentRun = Pick<
  Tables['game_runs'],
  'id' | 'score' | 'turns_survived' | 'is_win' | 'difficulty' | 'created_at'
>;

const RECENT_RUNS_LIMIT = 10;

async function fetchProfileUsername(userId: string): Promise<string | null> {
  const { data, error } = await supabase.from('profiles').select('username').eq('id', userId).maybeSingle();
  if (error) throw error;
  return data?.username ?? null;
}

async function fetchRecentRuns(userId: string): Promise<{ runs: RecentRun[]; total: number }> {
  const { data, count, error } = await supabase
    .from('game_runs')
    .select('id, score, turns_survived, is_win, difficulty, created_at', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(RECENT_RUNS_LIMIT);
  if (error) throw error;
  const runs = (data ?? []) as RecentRun[];
  return { runs, total: count ?? runs.length };
}

export function profileUsernameQuery(userId: string | undefined) {
  return queryOptions({
    queryKey: ['profile-username', userId],
    queryFn: () => fetchProfileUsername(userId as string),
    enabled: !!userId && !isOfflineMode,
  });
}

export function recentRunsQuery(userId: string | undefined) {
  return queryOptions({
    queryKey: ['recent-runs', userId],
    queryFn: () => fetchRecentRuns(userId as string),
    enabled: !!userId && !isOfflineMode,
  });
}

export function useProfileUsername(userId: string | undefined) {
  return useQuery(profileUsernameQuery(userId));
}

export function useRecentRuns(userId: string | undefined) {
  return useQuery(recentRunsQuery(userId));
}
