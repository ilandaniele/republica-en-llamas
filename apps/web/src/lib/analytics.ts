import posthog from 'posthog-js';

const KEY = (import.meta.env as Record<string,string>)['VITE_POSTHOG_KEY'];
const HOST = 'https://app.posthog.com';
let initialised = false;

export function initAnalytics() {
  if (initialised || !KEY) return;
  posthog.init(KEY, { api_host: HOST, capture_pageview: false, persistence: 'localStorage' });
  initialised = true;
}

export function identifyUser(userId: string, props?: Record<string, unknown>) {
  if (!initialised) return;
  posthog.identify(userId, props);
}

export function resetUser() {
  if (!initialised) return;
  posthog.reset();
}

export function trackGameStarted(p: { difficulty: string; president: string; mode: string }) {
  posthog.capture('game_started', p);
}

export function trackGameOver(p: { turns_survived: number; reason: string; score: number; difficulty: string; president: string }) {
  posthog.capture('game_over', p);
}

export function trackTurnCompleted(p: { turn_number: number; event_category: string; choice_index: number }) {
  posthog.capture('turn_completed', p);
}

export function trackPaywallShown(p: { entitlement: string; trigger_point: string; ab_variant?: string }) {
  posthog.capture('paywall_shown', p);
}

export function trackPurchaseStarted(p: { entitlement: string; price: number }) {
  posthog.capture('purchase_started', p);
}

export function trackPurchaseCompleted(p: { entitlement: string; price: number; platform: string }) {
  posthog.capture('purchase_completed', p);
}

export function trackAdShown(p: { placement: string }) {
  posthog.capture('ad_shown', { ...p, rewarded: true });
}

export function trackAdRewarded(p: { placement: string }) {
  posthog.capture('ad_rewarded', p);
}

export function trackCongressSession(p: { law: string; turn: number }) {
  posthog.capture('congress_session_shown', p);
}

export function trackCrisisTriggered(p: { crisis_type: string; turn: number }) {
  posthog.capture('crisis_triggered', p);
}

export function trackShareClicked(p: { share_type: 'game_over' | 'score' | 'image' }) {
  posthog.capture('share_clicked', p);
}
