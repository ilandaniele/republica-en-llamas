import { queryOptions, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase.js';
import { PERSISTED_GC_TIME } from '../app/queryClient.js';
import { prefetchRoute } from '../app/routes.js';

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  username: string;
  avatar_url: string | null;
  difficulty: string;
  score: number;
  turns_survived: number;
  is_win: boolean;
  created_at: string;
}

const LEADERBOARD_COLUMNS =
  'id, user_id, username, avatar_url, difficulty, score, turns_survived, is_win, created_at';

async function fetchLeaderboard(difficulty?: string): Promise<LeaderboardEntry[]> {
  let query = supabase
    .from('leaderboard')
    .select(LEADERBOARD_COLUMNS)
    .order('score', { ascending: false })
    .limit(100);
  if (difficulty) query = query.eq('difficulty', difficulty);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as LeaderboardEntry[];
}

export function leaderboardQuery(difficulty?: string) {
  return queryOptions({
    queryKey: ['leaderboard', difficulty ?? 'all'],
    queryFn: () => fetchLeaderboard(difficulty),
    staleTime: 60_000,
    gcTime: PERSISTED_GC_TIME,
  });
}

export function useLeaderboard(difficulty?: string) {
  return useQuery(leaderboardQuery(difficulty));
}

// Warms the screen chunk and its data on hover/focus, before the user clicks.
export function usePrefetchLeaderboard() {
  const queryClient = useQueryClient();
  return () => {
    prefetchRoute('leaderboard');
    void queryClient.prefetchQuery(leaderboardQuery());
  };
}
