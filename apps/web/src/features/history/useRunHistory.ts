import { useQuery } from '@tanstack/react-query';
import { fetchRunHistory } from '../../lib/runHistory.js';

export function useRunHistory(userId: string | undefined) {
  return useQuery({
    queryKey: ['run-history', userId],
    enabled: !!userId,
    queryFn: async () => (await fetchRunHistory()).runs,
  });
}
