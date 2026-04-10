import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase.js';
export function useRunHistory(userId) {
    return useQuery({
        queryKey: ['run-history', userId],
        enabled: !!userId,
        queryFn: async () => {
            const { data, error } = await supabase
                .from('game_runs')
                .select('*, run_events(*)')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(20);
            if (error)
                throw error;
            return data ?? [];
        },
    });
}
//# sourceMappingURL=useRunHistory.js.map