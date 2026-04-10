export interface LeaderboardEntry {
    id: string;
    user_id: string;
    username: string;
    avatar_url: string | null;
    difficulty: string;
    score: number;
    turns_survived: number;
    is_win: boolean;
    created_at: string;
}
export declare function useLeaderboard(difficulty?: string): import("@tanstack/react-query").UseQueryResult<LeaderboardEntry[], Error>;
//# sourceMappingURL=useLeaderboard.d.ts.map