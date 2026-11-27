import type { RunConfig } from './run.js';
import type { Language } from './types.js';

const SEED_SPACE = 1_000_000;
const FNV_OFFSET = 0x811c9dc5;
const FNV_PRIME = 0x01000193;

export const DAILY_CHALLENGE_DIFFICULTY = 'normal' as const;

export function dailyChallengeDate(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export function dailyChallengeSeed(date: string): number {
  let hash = FNV_OFFSET;
  for (const char of `republica-daily:${date}`) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, FNV_PRIME) >>> 0;
  }
  return hash % SEED_SPACE;
}

export function dailyChallengeConfig(date: string, presidentId: string, language: Language): RunConfig {
  return {
    seed: dailyChallengeSeed(date),
    difficulty: DAILY_CHALLENGE_DIFFICULTY,
    language,
    scenarioId: null,
    crisisExpress: false,
    presidentId,
  };
}

export function isDailyChallengeConfig(config: RunConfig, date: string): boolean {
  return (
    config.seed === dailyChallengeSeed(date) &&
    config.difficulty === DAILY_CHALLENGE_DIFFICULTY &&
    !config.scenarioId &&
    !config.crisisExpress &&
    !config.careerStart
  );
}
