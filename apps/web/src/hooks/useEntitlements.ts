import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase.js';
import { useAuth } from './useAuth.js';
import type { EntitlementId } from '@republica/game-engine';

const DAILY_KEY = 'rep_daily_runs';

interface DailyRuns { date: string; count: number }

function getTodayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function getDailyRunsRemaining(): number {
  try {
    const raw = localStorage.getItem(DAILY_KEY);
    if (!raw) return 3;
    const d: DailyRuns = JSON.parse(raw) as DailyRuns;
    if (d.date !== getTodayStr()) return 3;
    return Math.max(0, 3 - d.count);
  } catch {
    return 3;
  }
}

export function consumeDailyRun() {
  try {
    const raw = localStorage.getItem(DAILY_KEY);
    const today = getTodayStr();
    const d: DailyRuns = raw ? (JSON.parse(raw) as DailyRuns) : { date: today, count: 0 };
    if (d.date !== today) { localStorage.setItem(DAILY_KEY, JSON.stringify({ date: today, count: 1 })); return; }
    localStorage.setItem(DAILY_KEY, JSON.stringify({ date: today, count: d.count + 1 }));
  } catch { /* ignore */ }
}

export function useEntitlements() {
  const { user } = useAuth();

  const { data: entitlements = [], isLoading, refetch } = useQuery({
    queryKey: ['entitlements', user?.id],
    queryFn: async () => {
      if (!user) return [] as EntitlementId[];
      const { data, error } = await supabase
        .from('user_entitlements')
        .select('entitlement')
        .eq('user_id', user.id);
      if (error) return [] as EntitlementId[];
      return (data ?? []).map((r: { entitlement: string }) => r.entitlement as EntitlementId);
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  function hasEntitlement(id: EntitlementId | string): boolean {
    if (entitlements.includes('full_access' as EntitlementId)) return true;
    return entitlements.includes(id as EntitlementId);
  }

  const hasPremium = entitlements.length > 0;

  return { entitlements, hasEntitlement, hasPremium, isLoading, refetch };
}
