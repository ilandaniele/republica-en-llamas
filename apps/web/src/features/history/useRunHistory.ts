import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase.js';

export function useRunHistory(userId: string | undefined) {
  return useQuery({
    queryKey: ['run-history', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('game_runs')
        .select(
          'id, difficulty, turns_survived, created_at, game_over_reason, score, is_win, run_events(turn_number, card_id, choice_index)',
        )
        .eq('user_id', userId as string)
        .order('created_at', { ascending: false })
        .limit(20)
        .order('turn_number', { referencedTable: 'run_events' })
        .limit(10, { referencedTable: 'run_events' });

      if (error) throw error;
      return data ?? [];
    },
  });
}
