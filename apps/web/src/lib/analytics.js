import posthog from 'posthog-js';
const KEY = import.meta.env['VITE_POSTHOG_KEY'];
const HOST = 'https://app.posthog.com';
let initialised = false;
export function initAnalytics() {
    if (initialised || !KEY)
        return;
    posthog.init(KEY, { api_host: HOST, capture_pageview: false, persistence: 'localStorage' });
    initialised = true;
}
export function identifyUser(userId, props) {
    if (!initialised)
        return;
    posthog.identify(userId, props);
}
export function resetUser() {
    if (!initialised)
        return;
    posthog.reset();
}
export function trackGameStarted(p) {
    posthog.capture('game_started', p);
}
export function trackGameOver(p) {
    posthog.capture('game_over', p);
}
export function trackTurnCompleted(p) {
    posthog.capture('turn_completed', p);
}
export function trackPaywallShown(p) {
    posthog.capture('paywall_shown', p);
}
export function trackPurchaseStarted(p) {
    posthog.capture('purchase_started', p);
}
export function trackPurchaseCompleted(p) {
    posthog.capture('purchase_completed', p);
}
export function trackAdShown(p) {
    posthog.capture('ad_shown', { ...p, rewarded: true });
}
export function trackAdRewarded(p) {
    posthog.capture('ad_rewarded', p);
}
export function trackCongressSession(p) {
    posthog.capture('congress_session_shown', p);
}
export function trackCrisisTriggered(p) {
    posthog.capture('crisis_triggered', p);
}
export function trackShareClicked(p) {
    posthog.capture('share_clicked', p);
}
//# sourceMappingURL=analytics.js.map