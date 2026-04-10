import type { User, Session } from '@supabase/supabase-js';
export declare function useAuth(): {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<import("@supabase/auth-js").AuthTokenResponsePassword>;
    signUp: (email: string, password: string, username: string) => Promise<import("@supabase/auth-js").AuthResponse>;
    signOut: () => Promise<{
        error: import("@supabase/auth-js").AuthError | null;
    }>;
    updateUsername: (username: string) => Promise<import("@supabase/postgrest-js").PostgrestResponseFailure | import("@supabase/postgrest-js").PostgrestResponseSuccess<null> | {
        error: Error;
    }>;
};
//# sourceMappingURL=useAuth.d.ts.map