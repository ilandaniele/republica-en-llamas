import { scenarioAchievements } from '@republica/game-engine';
import { requireUser } from '../context.js';
import type { RouteContext } from '../context.js';
import { json } from '../http.js';

export const SCENARIO_RECORDS_SQL = `select scenario_id as scenarioId, count(*) as runs, sum(is_win) as wins,
    max(score) as bestScore
  from game_runs
  where user_id = ?1 and completed_at is not null and scenario_id is not null
  group by scenario_id`;

interface ScenarioRecordRow {
  scenarioId: string;
  runs: number;
  wins: number;
  bestScore: number;
}

export async function listAchievements(ctx: RouteContext): Promise<Response> {
  const user = await requireUser(ctx);
  const { results } = await ctx.env.DB.prepare(SCENARIO_RECORDS_SQL).bind(user.id).all<ScenarioRecordRow>();
  return json({ scenarios: scenarioAchievements(results) });
}
