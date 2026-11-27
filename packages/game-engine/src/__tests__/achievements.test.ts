import { describe, expect, it } from 'vitest';
import { HISTORICAL_SCENARIOS } from '../constants.js';
import { scenarioAchievements } from '../achievements.js';

describe('scenario achievements', () => {
  it('lists every historical scenario as locked without runs', () => {
    const achievements = scenarioAchievements([]);
    expect(achievements).toHaveLength(Object.keys(HISTORICAL_SCENARIOS).length);
    expect(achievements.every((achievement) => achievement.tier === 'locked')).toBe(true);
  });

  it('marks played and won scenarios with their best score', () => {
    const achievements = scenarioAchievements([
      { scenarioId: 'corralito_2001', runs: 3, wins: 0, bestScore: 900 },
      { scenarioId: 'malvinas_1982', runs: 1, wins: 1, bestScore: 4_200 },
      { scenarioId: 'unknown', runs: 5, wins: 5, bestScore: 1 },
    ]);
    const byId = new Map(achievements.map((achievement) => [achievement.scenarioId as string, achievement]));
    expect(byId.get('corralito_2001')).toMatchObject({ tier: 'played', bestScore: 900 });
    expect(byId.get('malvinas_1982')).toMatchObject({ tier: 'won', bestScore: 4_200 });
    expect(byId.get('rodrigazo_1975')).toMatchObject({ tier: 'locked', bestScore: 0 });
    expect(byId.has('unknown')).toBe(false);
  });
});
