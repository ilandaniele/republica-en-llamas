const API_URL = process.env['EXPO_PUBLIC_API_URL'] ?? 'https://republica-en-llamas.ilandaniele.workers.dev';

export interface LeaderboardEntry {
  id: string;
  username: string;
  difficulty: string;
  score: number;
  turns_survived: number;
  is_win: boolean;
}

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  const response = await fetch(`${API_URL}/api/leaderboard`);
  if (!response.ok) throw new Error(`Leaderboard request failed: ${response.status}`);
  return (await response.json()) as LeaderboardEntry[];
}
