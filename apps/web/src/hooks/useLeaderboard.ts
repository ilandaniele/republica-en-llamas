import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase.js';

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

export function useLeaderboard(difficulty?: string) {
  return useQuery({
    queryKey: ['leaderboard', difficulty],
    queryFn: async (): Promise<LeaderboardEntry[]> => {
      let query = supabase
        .from('leaderboard')
        .select('*')
        .order('score', { ascending: false })
        .limit(100);

      if (difficulty) {
        query = query.eq('difficulty', difficulty);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as LeaderboardEntry[];
    },
    staleTime: 60_000,
  });
}
