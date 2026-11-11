import { queryOptions, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet } from '../lib/api.js';
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

function fetchLeaderboard(difficulty?: string): Promise<LeaderboardEntry[]> {
  const params = difficulty ? `?${new URLSearchParams({ difficulty }).toString()}` : '';
  return apiGet<LeaderboardEntry[]>(`leaderboard${params}`);
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
