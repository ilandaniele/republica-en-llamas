import { describe, expect, it } from 'vitest';
import {
  DAILY_CHALLENGE_DIFFICULTY,
  dailyChallengeConfig,
  dailyChallengeDate,
  dailyChallengeSeed,
  isDailyChallengeConfig,
} from '../dailyChallenge.js';

const DATE = '2026-11-27';

describe('daily challenge', () => {
  it('uses the UTC calendar day', () => {
    expect(dailyChallengeDate(new Date('2026-11-27T23:59:59Z'))).toBe(DATE);
    expect(dailyChallengeDate(new Date('2026-11-28T00:00:00Z'))).toBe('2026-11-28');
  });

  it('gives the same seed for the same day and a different one for the next day', () => {
    expect(dailyChallengeSeed(DATE)).toBe(dailyChallengeSeed(DATE));
    expect(dailyChallengeSeed(DATE)).not.toBe(dailyChallengeSeed('2026-11-28'));
    expect(dailyChallengeSeed(DATE)).toBeGreaterThanOrEqual(0);
    expect(dailyChallengeSeed(DATE)).toBeLessThan(1_000_000);
  });

  it('accepts only the fixed daily rules', () => {
    const config = { seed: dailyChallengeSeed(DATE), difficulty: DAILY_CHALLENGE_DIFFICULTY };
    expect(isDailyChallengeConfig(config, DATE)).toBe(true);
    expect(isDailyChallengeConfig({ ...config, presidentId: 'populista' }, DATE)).toBe(true);
    expect(isDailyChallengeConfig({ ...config, seed: config.seed + 1 }, DATE)).toBe(false);
    expect(isDailyChallengeConfig({ ...config, difficulty: 'easy' }, DATE)).toBe(false);
    expect(isDailyChallengeConfig({ ...config, crisisExpress: true }, DATE)).toBe(false);
    expect(isDailyChallengeConfig({ ...config, scenarioId: 'corralito_2001' }, DATE)).toBe(false);
  });

  it('builds a config that satisfies the daily rules', () => {
    expect(isDailyChallengeConfig(dailyChallengeConfig(DATE, 'milei', 'en'), DATE)).toBe(true);
  });
});
