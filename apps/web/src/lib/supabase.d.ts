export declare const isOfflineMode: boolean;
export declare const missingEnvVars: {
    url: boolean;
    key: boolean;
};
export declare const supabase: import("@supabase/supabase-js").SupabaseClient<any, "public", "public", any, any>;
/** Translate Supabase error messages to Spanish */
export declare function translateAuthError(message: string): string;
export declare function signIn(email: string, password: string): Promise<import("@supabase/auth-js").AuthTokenResponsePassword>;
export declare function signUp(email: string, password: string, username: string): Promise<import("@supabase/auth-js").AuthResponse>;
export declare function signOut(): Promise<{
    error: import("@supabase/auth-js").AuthError | null;
}>;
export declare function getSession(): Promise<{
    data: {
        session: import("@supabase/auth-js").Session;
    };
    error: null;
} | {
    data: {
        session: null;
    };
    error: import("@supabase/auth-js").AuthError;
} | {
    data: {
        session: null;
    };
    error: null;
}>;
export declare function signInWithGoogle(): Promise<import("@supabase/auth-js").OAuthResponse>;
/**
 * Ensure a profile row exists for OAuth users (upsert on first login).
 * Call this inside onAuthStateChange when provider === 'google'.
 */
export declare function ensureProfile(userId: string, email: string): Promise<void>;
export declare function checkUsernameAvailable(username: string): Promise<boolean>;
export type Tables = {
    profiles: {
        id: string;
        username: string;
        country: string;
        avatar_url: string | null;
        created_at: string;
        updated_at: string;
    };
    game_runs: {
        id: string;
        user_id: string;
        difficulty: 'easy' | 'normal' | 'hard' | 'crisis';
        seed: number;
        score: number;
        turns_survived: number;
        game_over_reason: string | null;
        is_win: boolean;
        final_state: unknown;
        language: string;
        created_at: string;
        completed_at: string | null;
    };
    run_events: {
        id: string;
        run_id: string;
        turn_number: number;
        card_id: string;
        choice_index: number;
        negotiation: string | null;
        effects_json: unknown;
        state_snapshot: unknown;
        created_at: string;
    };
};
//# sourceMappingURL=supabase.d.ts.map