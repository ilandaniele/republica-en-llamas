import { apiGet } from './api.js';

export interface RunEventSummary {
  turn_number: number;
  card_id: string;
  choice_index: number;
}

export interface RunSummary {
  id: string;
  difficulty: string;
  turns_survived: number;
  created_at: string;
  game_over_reason: string | null;
  score: number;
  is_win: boolean;
  run_events: RunEventSummary[];
}

export interface RunHistory {
  runs: RunSummary[];
  total: number;
}

export function fetchRunHistory(): Promise<RunHistory> {
  return apiGet<RunHistory>('runs');
}
