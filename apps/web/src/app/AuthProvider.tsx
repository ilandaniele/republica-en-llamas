import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { ensureProfile, supabase } from '../lib/supabase.js';
import { AuthContext } from './authContext.js';
import type { AuthState } from './authContext.js';

// Anonymous sessions only carry guest run tickets; the rest of the app treats guests as signed out.
function stateFromSession(session: Session | null): AuthState {
  const signedIn = session && !session.user.is_anonymous ? session : null;
  return { user: signedIn?.user ?? null, session: signedIn, loading: false };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, session: null, loading: true });

  useEffect(() => {
    void supabase.auth.getSession().then(({ data: { session } }) => setState(stateFromSession(session)));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setState(stateFromSession(session));
      if (event === 'SIGNED_IN' && session?.user.app_metadata?.['provider'] === 'google') {
        void ensureProfile(session.user.id, session.user.email ?? '');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}
