import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase.js';
export function useLeaderboard(difficulty) {
    return useQuery({
        queryKey: ['leaderboard', difficulty],
        queryFn: async () => {
            let query = supabase
                .from('leaderboard')
                .select('*')
                .order('score', { ascending: false })
                .limit(100);
            if (difficulty) {
                query = query.eq('difficulty', difficulty);
            }
            const { data, error } = await query;
            if (error)
                throw error;
            return (data ?? []);
        },
        staleTime: 60_000,
    });
}
//# sourceMappingURL=useLeaderboard.js.map