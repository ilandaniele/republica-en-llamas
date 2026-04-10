import type { EntitlementId } from '@republica/game-engine';
export declare function getDailyRunsRemaining(): number;
export declare function consumeDailyRun(): void;
export declare function useEntitlements(): {
    entitlements: EntitlementId[];
    hasEntitlement: (id: EntitlementId | string) => boolean;
    hasPremium: boolean;
    isLoading: boolean;
    refetch: (options?: import("@tanstack/query-core").RefetchOptions) => Promise<import("@tanstack/query-core").QueryObserverResult<EntitlementId[], Error>>;
};
//# sourceMappingURL=useEntitlements.d.ts.map