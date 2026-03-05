import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase.js';

export function useRunHistory(userId: string | undefined) {
  return useQuery({
    queryKey: ['run-history', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('game_runs')
        .select('*, run_events(*)')
        .eq('user_id', userId as string)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data ?? [];
    },
  });
}
