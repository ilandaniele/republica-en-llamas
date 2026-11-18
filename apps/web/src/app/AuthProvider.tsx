import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { isOfflineMode } from '../lib/api.js';
import { authClient } from '../lib/auth.js';
import { isPlaytestMode } from '../lib/playtest.js';
import { AuthContext } from './authContext.js';
import type { AuthState } from './authContext.js';

const PRIVATE_QUERY_ROOTS = new Set(['entitlements', 'profile-username', 'recent-runs', 'run-history']);
const SIGNED_OUT: AuthState = { user: null, loading: false };

// Anonymous sessions only carry guest run tickets; the rest of the app treats guests as signed out.
function SessionProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { data, isPending, error } = authClient.useSession();
  const sessionAccount = data && !data.user.isAnonymous ? data.user : null;
  // A failed session check (e.g. 429) is not a sign-out; keep the last known user until a refetch succeeds.
  const [lastAccount, setLastAccount] = useState(sessionAccount);
  if (!error && !isPending && lastAccount !== sessionAccount) setLastAccount(sessionAccount);
  const account = error ? lastAccount : sessionAccount;
  const userId = account?.id ?? null;
  const ownerRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (isPending || error) return;
    if (ownerRef.current !== userId || !userId) {
      queryClient.removeQueries({ predicate: (query) => PRIVATE_QUERY_ROOTS.has(String(query.queryKey[0])) });
    }
    ownerRef.current = userId;
  }, [isPending, error, userId, queryClient]);

  const state = useMemo<AuthState>(
    () => ({
      user: account ? { id: account.id, email: account.email, name: account.name } : null,
      loading: isPending,
    }),
    [account, isPending],
  );

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  if (isPlaytestMode || isOfflineMode) {
    return <AuthContext.Provider value={SIGNED_OUT}>{children}</AuthContext.Provider>;
  }
  return <SessionProvider>{children}</SessionProvider>;
}
