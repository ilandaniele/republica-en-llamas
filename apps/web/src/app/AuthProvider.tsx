import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import {
  ensureProfile,
  supabase,
  isOfflineMode,
  subscribeToAuth,
  isPasswordRecovery,
} from '../lib/supabase.js';
import { isPlaytestMode } from '../lib/playtest.js';
import { AuthContext } from './authContext.js';
import type { AuthState } from './authContext.js';

const PRIVATE_QUERY_ROOTS = new Set(['entitlements', 'profile-username', 'recent-runs', 'run-history']);

// Anonymous sessions only carry guest run tickets; the rest of the app treats guests as signed out.
function stateFromSession(session: Session | null): AuthState {
  const signedIn = session && !session.user.is_anonymous ? session : null;
  return {
    user: signedIn?.user ?? null,
    session: signedIn,
    loading: false,
    passwordRecovery: isPasswordRecovery(signedIn?.user.id),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: !isPlaytestMode && !isOfflineMode,
    passwordRecovery: false,
  });

  useEffect(() => {
    if (isPlaytestMode || isOfflineMode) return;
    let active = true;
    let authEventReceived = false;
    let ownerId: string | null = null;
    const applySession = (session: Session | null) => {
      if (!active) return;
      const next = stateFromSession(session);
      const nextOwner = next.user?.id ?? null;
      if (ownerId !== nextOwner || !nextOwner) {
        queryClient.removeQueries({
          predicate: (query) => PRIVATE_QUERY_ROOTS.has(String(query.queryKey[0])),
        });
      }
      ownerId = nextOwner;
      setState(next);
    };
    void supabase.auth.getSession().then(
      ({ data: { session } }) => {
        if (!authEventReceived) applySession(session);
      },
      () => {
        if (!authEventReceived) applySession(null);
      },
    );

    const unsubscribe = subscribeToAuth((event, session) => {
      if (!active) return;
      authEventReceived = true;
      applySession(session);
      if (event === 'SIGNED_IN' && session?.user.app_metadata?.['provider'] === 'google') {
        void ensureProfile(session.user.id, session.user.email ?? '').catch(() => {});
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [queryClient]);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}
