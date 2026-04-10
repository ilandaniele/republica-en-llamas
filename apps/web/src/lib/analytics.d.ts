export declare function initAnalytics(): void;
export declare function identifyUser(userId: string, props?: Record<string, unknown>): void;
export declare function resetUser(): void;
export declare function trackGameStarted(p: {
    difficulty: string;
    president: string;
    mode: string;
}): void;
export declare function trackGameOver(p: {
    turns_survived: number;
    reason: string;
    score: number;
    difficulty: string;
    president: string;
}): void;
export declare function trackTurnCompleted(p: {
    turn_number: number;
    event_category: string;
    choice_index: number;
}): void;
export declare function trackPaywallShown(p: {
    entitlement: string;
    trigger_point: string;
    ab_variant?: string;
}): void;
export declare function trackPurchaseStarted(p: {
    entitlement: string;
    price: number;
}): void;
export declare function trackPurchaseCompleted(p: {
    entitlement: string;
    price: number;
    platform: string;
}): void;
export declare function trackAdShown(p: {
    placement: string;
}): void;
export declare function trackAdRewarded(p: {
    placement: string;
}): void;
export declare function trackCongressSession(p: {
    law: string;
    turn: number;
}): void;
export declare function trackCrisisTriggered(p: {
    crisis_type: string;
    turn: number;
}): void;
export declare function trackShareClicked(p: {
    share_type: 'game_over' | 'score' | 'image';
}): void;
//# sourceMappingURL=analytics.d.ts.map