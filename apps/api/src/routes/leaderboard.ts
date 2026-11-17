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

const LEADERBOARD_BASE_SQL = `select r.id, r.user_id, p.username, p.avatar_url, r.difficulty, r.score,
    r.turns_survived, r.is_win, r.created_at
  from game_runs r join profiles p on p.id = r.user_id
  where r.completed_at is not null`;

export const LEADERBOARD_SQL = `${LEADERBOARD_BASE_SQL} order by r.score desc limit ?1`;
export const LEADERBOARD_BY_DIFFICULTY_SQL = `${LEADERBOARD_BASE_SQL} and r.difficulty = ?2
  order by r.score desc limit ?1`;

function leaderboardQuery(db: D1Database, difficulty: string | null): D1PreparedStatement {
  return difficulty === null
    ? db.prepare(LEADERBOARD_SQL).bind(LEADERBOARD_LIMIT)
    : db.prepare(LEADERBOARD_BY_DIFFICULTY_SQL).bind(LEADERBOARD_LIMIT, difficulty);
}

export async function leaderboard(ctx: RouteContext): Promise<Response> {
  const difficulty = ctx.url.searchParams.get('difficulty');
  if (difficulty !== null && !DIFFICULTIES.has(difficulty)) throw new RequestError(400, 'Unknown difficulty');
  const { results } = await leaderboardQuery(ctx.env.DB, difficulty).all<LeaderboardRow>();
  const entries = results.map((row) => ({ ...row, is_win: row.is_win === 1 }));
  return json(entries, 200, { 'Cache-Control': 'public, max-age=30' });
}
