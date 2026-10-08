import type { PostHog } from 'posthog-js';

const KEY = (import.meta.env as Record<string, string | undefined>)['VITE_POSTHOG_KEY'];
const HOST = 'https://app.posthog.com';

type Props = Record<string, unknown>;

let client: PostHog | null = null;
let loading: Promise<void> | null = null;
const pending: Array<(ph: PostHog) => void> = [];

function withClient(action: (ph: PostHog) => void) {
  if (!KEY) return;
  if (client) action(client);
  else pending.push(action);
}

// posthog-js is loaded lazily so it stays out of the entry chunk.
export function initAnalytics() {
  if (loading || !KEY) return;
  loading = import('posthog-js').then(({ default: posthog }) => {
    posthog.init(KEY, { api_host: HOST, capture_pageview: false, persistence: 'localStorage' });
    client = posthog;
    pending.splice(0).forEach((action) => action(posthog));
  });
}

export function getFeatureFlag(flag: string): string | undefined {
  const value = client?.getFeatureFlag(flag);
  return typeof value === 'string' ? value : undefined;
}

function capture(event: string, props: Props) {
  withClient((ph) => ph.capture(event, props));
}

export function identifyUser(userId: string, props?: Props) {
  withClient((ph) => ph.identify(userId, props));
}

export function resetUser() {
  withClient((ph) => ph.reset());
}

export function trackGameStarted(p: { difficulty: string; president: string; mode: string }) {
  capture('game_started', p);
}

export function trackGameOver(p: {
  turns_survived: number;
  reason: string;
  score: number;
  difficulty: string;
  president: string;
}) {
  capture('game_over', p);
}

export function trackTurnCompleted(p: { turn_number: number; event_category: string; choice_index: number }) {
  capture('turn_completed', p);
}

export function trackPaywallShown(p: { entitlement: string; trigger_point: string; ab_variant?: string }) {
  capture('paywall_shown', p);
}

export function trackPurchaseStarted(p: { entitlement: string; price: number }) {
  capture('purchase_started', p);
}

export function trackPurchaseCompleted(p: { entitlement: string; price: number; platform: string }) {
  capture('purchase_completed', p);
}

export function trackAdShown(p: { placement: string }) {
  capture('ad_shown', { ...p, rewarded: true });
}

export function trackAdRewarded(p: { placement: string }) {
  capture('ad_rewarded', p);
}

export function trackCongressSession(p: { law: string; turn: number }) {
  capture('congress_session_shown', p);
}

export function trackCrisisTriggered(p: { crisis_type: string; turn: number }) {
  capture('crisis_triggered', p);
}

export function trackShareClicked(p: { share_type: 'game_over' | 'score' | 'image' }) {
  capture('share_clicked', p);
}

// PostHog requires this exact event name for experiment exposure.
export function trackExperimentStarted(p: { experiment: string; variant: string }) {
  capture('$experiment_started', p);
}
