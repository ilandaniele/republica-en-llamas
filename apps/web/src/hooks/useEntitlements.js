import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase.js';
import { useAuth } from './useAuth.js';
const DAILY_KEY = 'rep_daily_runs';
function getTodayStr() {
    return new Date().toISOString().slice(0, 10);
}
export function getDailyRunsRemaining() {
    try {
        const raw = localStorage.getItem(DAILY_KEY);
        if (!raw)
            return 3;
        const d = JSON.parse(raw);
        if (d.date !== getTodayStr())
            return 3;
        return Math.max(0, 3 - d.count);
    }
    catch {
        return 3;
    }
}
export function consumeDailyRun() {
    try {
        const raw = localStorage.getItem(DAILY_KEY);
        const today = getTodayStr();
        const d = raw ? JSON.parse(raw) : { date: today, count: 0 };
        if (d.date !== today) {
            localStorage.setItem(DAILY_KEY, JSON.stringify({ date: today, count: 1 }));
            return;
        }
        localStorage.setItem(DAILY_KEY, JSON.stringify({ date: today, count: d.count + 1 }));
    }
    catch { /* ignore */ }
}
export function useEntitlements() {
    const { user } = useAuth();
    const { data: entitlements = [], isLoading, refetch } = useQuery({
        queryKey: ['entitlements', user?.id],
        queryFn: async () => {
            if (!user)
                return [];
            const { data, error } = await supabase
                .from('user_entitlements')
                .select('entitlement')
                .eq('user_id', user.id);
            if (error)
                return [];
            return (data ?? []).map((r) => r.entitlement);
        },
        enabled: !!user,
        staleTime: 5 * 60 * 1000,
    });
    function hasEntitlement(id) {
        if (entitlements.includes('full_access'))
            return true;
        return entitlements.includes(id);
    }
    const hasPremium = entitlements.length > 0;
    return { entitlements, hasEntitlement, hasPremium, isLoading, refetch };
}
//# sourceMappingURL=useEntitlements.js.map