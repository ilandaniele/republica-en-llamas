import type { RouteContext } from '../context.js';
import { json, RequestError } from '../http.js';

const DIFFICULTIES = new Set(['easy', 'normal', 'hard', 'crisis']);
const LEADERBOARD_LIMIT = 100;

interface LeaderboardRow {
  id: string;
  user_id: string;
  username: string;
  avatar_url: string | null;
  difficulty: string;
  score: number;
  turns_survived: number;
  is_win: number;
  created_at: string;
}

const LEADERBOARD_SQL = `select r.id, r.user_id, p.username, p.avatar_url, r.difficulty, r.score,
    r.turns_survived, r.is_win, r.created_at
  from game_runs r join profiles p on p.id = r.user_id
  where r.completed_at is not null and (?1 is null or r.difficulty = ?1)
  order by r.score desc limit ?2`;

export async function leaderboard(ctx: RouteContext): Promise<Response> {
  const difficulty = ctx.url.searchParams.get('difficulty');
  if (difficulty !== null && !DIFFICULTIES.has(difficulty)) throw new RequestError(400, 'Unknown difficulty');
  const { results } = await ctx.env.DB.prepare(LEADERBOARD_SQL)
    .bind(difficulty, LEADERBOARD_LIMIT)
    .all<LeaderboardRow>();
  const entries = results.map((row) => ({ ...row, is_win: row.is_win === 1 }));
  return json(entries, 200, { 'Cache-Control': 'public, max-age=30' });
}
