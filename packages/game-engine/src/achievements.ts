import { HISTORICAL_SCENARIOS } from './constants.js';
import type { ScenarioId } from './types.js';

export type AchievementTier = 'locked' | 'played' | 'won';

export interface ScenarioRecord {
  scenarioId: string;
  runs: number;
  wins: number;
  bestScore: number;
}

export interface ScenarioAchievement {
  scenarioId: ScenarioId;
  labelKey: string;
  tier: AchievementTier;
  bestScore: number;
}

const SCENARIO_IDS = Object.keys(HISTORICAL_SCENARIOS) as ScenarioId[];

function tierOf(record: ScenarioRecord | undefined): AchievementTier {
  if (!record || record.runs === 0) return 'locked';
  return record.wins > 0 ? 'won' : 'played';
}

export function scenarioAchievements(records: readonly ScenarioRecord[]): ScenarioAchievement[] {
  const byScenario = new Map(records.map((record) => [record.scenarioId, record]));
  return SCENARIO_IDS.map((scenarioId) => {
    const record = byScenario.get(scenarioId);
    return {
      scenarioId,
      labelKey: HISTORICAL_SCENARIOS[scenarioId].labelKey,
      tier: tierOf(record),
      bestScore: record?.bestScore ?? 0,
    };
  });
}
