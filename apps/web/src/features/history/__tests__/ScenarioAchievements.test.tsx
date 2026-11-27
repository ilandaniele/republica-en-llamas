import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { ScenarioAchievement } from '@republica/game-engine';

const apiGet = vi.hoisted(() => vi.fn());
vi.mock('../../../lib/api.js', () => ({ apiGet }));
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

const { ScenarioAchievements } = await import('../ScenarioAchievements.js');
const { achievementsQuery } = await import('../useAchievements.js');

const ACHIEVEMENTS: ScenarioAchievement[] = [
  { scenarioId: 'corralito_2001', labelKey: 'scenario.corralito_2001.label', tier: 'won', bestScore: 4200 },
  { scenarioId: 'malvinas_1982', labelKey: 'scenario.malvinas_1982.label', tier: 'played', bestScore: 900 },
  { scenarioId: 'rodrigazo_1975', labelKey: 'scenario.rodrigazo_1975.label', tier: 'locked', bestScore: 0 },
];

describe('ScenarioAchievements', () => {
  it('shows each scenario tier and the conquered count', () => {
    render(<ScenarioAchievements achievements={ACHIEVEMENTS} />);
    expect(screen.getByText('1/3 superados')).toBeTruthy();
    expect(screen.getByText(/Superado/)).toBeTruthy();
    expect(screen.getByText(/Jugado/)).toBeTruthy();
    expect(screen.getByText('Sin jugar')).toBeTruthy();
  });

  it('fetches achievements only for a signed-in user', async () => {
    expect(achievementsQuery(undefined).enabled).toBe(false);
    apiGet.mockResolvedValue({ scenarios: ACHIEVEMENTS });
    const query = achievementsQuery('alice');
    expect(query.queryKey).toEqual(['achievements', 'alice']);
    const queryFn = query.queryFn as unknown as () => Promise<ScenarioAchievement[]>;
    expect(await queryFn()).toEqual(ACHIEVEMENTS);
    expect(apiGet).toHaveBeenCalledWith('achievements');
  });
});
