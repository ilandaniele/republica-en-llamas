import { queryOptions, useQuery } from '@tanstack/react-query';
import type { ScenarioAchievement } from '@republica/game-engine';
import { apiGet } from '../../lib/api.js';

interface AchievementsResponse {
  scenarios: ScenarioAchievement[];
}

export function achievementsQuery(userId: string | undefined) {
  return queryOptions({
    queryKey: ['achievements', userId],
    enabled: !!userId,
    queryFn: async () => (await apiGet<AchievementsResponse>('achievements')).scenarios,
  });
}

export function useAchievements(userId: string | undefined) {
  return useQuery(achievementsQuery(userId));
}
