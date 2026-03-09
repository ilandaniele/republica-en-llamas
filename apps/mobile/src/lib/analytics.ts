import PostHog from 'posthog-react-native';

const POSTHOG_KEY = process.env.EXPO_PUBLIC_POSTHOG_KEY ?? '';
const HOST = 'https://app.posthog.com';

let client: PostHog | null = null;

export function initAnalytics(): void {
  if (!POSTHOG_KEY) return;
  client = new PostHog(POSTHOG_KEY, { host: HOST });
}

export function identifyUser(userId: string, props?: Record<string, unknown>): void {
  client?.identify(userId, props);
}

export function resetUser(): void {
  client?.reset();
}

function capture(event: string, props?: Record<string, unknown>): void {
  client?.capture(event, props ?? {});
}

export const trackGameStarted = (p: { difficulty: string; president: string; mode: string }) =>
  capture('game_started', p);

export const trackGameOver = (p: { turns_survived: number; reason: string; score: number; difficulty: string; president: string }) =>
  capture('game_over', p);

export const trackTurnCompleted = (p: { turn_number: number; event_category: string; choice_index: number }) =>
  capture('turn_completed', p);

export const trackPaywallShown = (p: { entitlement: string; trigger_point: string }) =>
  capture('paywall_shown', p);

export const trackPurchaseStarted = (p: { entitlement: string; price: number }) =>
  capture('purchase_started', p);

export const trackPurchaseCompleted = (p: { entitlement: string; price: number; platform: string }) =>
  capture('purchase_completed', p);

export const trackAdShown = (p: { placement: string }) =>
  capture('ad_shown', p);

export const trackAdRewarded = (p: { placement: string }) =>
  capture('ad_rewarded', p);

export const trackCongressSession = (p: { law: string; turn: number }) =>
  capture('congress_session', p);

export const trackCrisisTriggered = (p: { crisis_id: string; turn: number }) =>
  capture('crisis_triggered', p);

export const trackShareClicked = (p: { channel: string }) =>
  capture('share_clicked', p);
