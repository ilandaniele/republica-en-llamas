import { queryOptions, useQuery } from '@tanstack/react-query';
import { apiGet } from '../lib/api.js';
import { useAuth } from './useAuth.js';
import type { EntitlementId } from '@republica/game-engine';
import { isPlaytestMode } from '../lib/playtest.js';

export function entitlementsQuery(userId: string | undefined) {
  return queryOptions({
    queryKey: ['entitlements', userId],
    queryFn: async () => (await apiGet<{ entitlements: EntitlementId[] }>('entitlements')).entitlements,
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useEntitlements() {
  const { user } = useAuth();
  const { data: entitlements = [], isLoading, refetch } = useQuery(entitlementsQuery(user?.id));

  function hasEntitlement(id: EntitlementId | string): boolean {
    if (isPlaytestMode) return ['mode_crisis_express', 'mode_historical', 'remove_ads'].includes(id);
    if (entitlements.includes('full_access' as EntitlementId)) return true;
    return entitlements.includes(id as EntitlementId);
  }

  const hasPremium = isPlaytestMode || entitlements.includes('full_access');

  return { entitlements, hasEntitlement, hasPremium, isLoading, refetch };
}
