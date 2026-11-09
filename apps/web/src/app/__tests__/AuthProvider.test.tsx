import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

const unsubscribe = vi.fn();
let authCallback: (event: AuthChangeEvent, session: Session | null) => void;
const onAuthStateChange = vi.fn((callback: typeof authCallback) => {
  authCallback = callback;
  return { data: { subscription: { unsubscribe } } };
});
const session = { user: { id: 'u1', app_metadata: {} } } as Session;
const getSession = vi.fn(() => Promise.resolve({ data: { session } }));

vi.mock('../../lib/supabase.js', () => ({
  isOfflineMode: false,
  ensureProfile: vi.fn(),
  signIn: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
  subscribeToAuth: (callback: typeof authCallback) =>
    onAuthStateChange(callback).data.subscription.unsubscribe,
  isPasswordRecovery: () => false,
  supabase: {
    auth: {
      getSession,
      onAuthStateChange,
    },
  },
}));

const { AuthProvider } = await import('../AuthProvider.js');
const { useAuth } = await import('../../hooks/useAuth.js');

function UserId() {
  const { user, loading } = useAuth();
  return <span>{loading ? 'loading' : (user?.id ?? 'signed out')}</span>;
}

beforeEach(() => vi.clearAllMocks());
afterEach(cleanup);

function mountAuth(client = new QueryClient()) {
  return render(
    <QueryClientProvider client={client}>
      <AuthProvider>
        <UserId />
        <UserId />
        <UserId />
      </AuthProvider>
    </QueryClientProvider>,
  );
}

describe('AuthProvider', () => {
  it('shares one auth subscription across all useAuth consumers', async () => {
    const { unmount } = mountAuth();

    expect(await screen.findAllByText('u1')).toHaveLength(3);
    expect(onAuthStateChange).toHaveBeenCalledTimes(1);

    unmount();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });

  it('does not restore a stale bootstrap session after a sign-out event', async () => {
    let resolveSession: (value: { data: { session: Session } }) => void = () => {};
    getSession.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveSession = resolve;
        }),
    );
    mountAuth();
    act(() => authCallback('SIGNED_OUT', null));
    await act(async () => resolveSession({ data: { session } }));
    expect(screen.getAllByText('signed out')).toHaveLength(3);
    expect(screen.queryByText('u1')).toBeNull();
  });

  it('removes private cached data on logout while keeping the public ranking', async () => {
    const client = new QueryClient();
    mountAuth(client);
    await screen.findAllByText('u1');
    for (const root of ['entitlements', 'profile-username', 'recent-runs', 'run-history', 'leaderboard'])
      client.setQueryData([root, 'u1'], ['private']);
    act(() => authCallback('SIGNED_OUT', null));
    for (const root of ['entitlements', 'profile-username', 'recent-runs', 'run-history'])
      expect(client.getQueryData([root, 'u1'])).toBeUndefined();
    expect(client.getQueryData(['leaderboard', 'u1'])).toEqual(['private']);
    client.clear();
  });
});
