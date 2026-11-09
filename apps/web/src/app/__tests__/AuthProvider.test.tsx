import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface SessionResult {
  data: { user: { id: string; email: string; name: string; isAnonymous?: boolean } } | null;
  isPending: boolean;
}

const signedIn: SessionResult = {
  data: { user: { id: 'u1', email: 'u1@example.test', name: 'u1', isAnonymous: false } },
  isPending: false,
};
const useSession = vi.hoisted(() => vi.fn<() => SessionResult>());

vi.mock('../../lib/api.js', () => ({ isOfflineMode: false }));
vi.mock('../../lib/auth.js', () => ({
  authClient: { useSession },
  saveUsername: vi.fn(),
  signIn: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
}));

const { AuthProvider } = await import('../AuthProvider.js');
const { useAuth } = await import('../../hooks/useAuth.js');

function UserId() {
  const { user, loading } = useAuth();
  return <span>{loading ? 'loading' : (user?.id ?? 'signed out')}</span>;
}

function tree(client: QueryClient) {
  return (
    <QueryClientProvider client={client}>
      <AuthProvider>
        <UserId />
        <UserId />
        <UserId />
      </AuthProvider>
    </QueryClientProvider>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  useSession.mockReturnValue(signedIn);
});
afterEach(cleanup);

describe('AuthProvider', () => {
  it('shares one session subscription across all useAuth consumers', () => {
    render(tree(new QueryClient()));
    expect(screen.getAllByText('u1')).toHaveLength(3);
    expect(useSession).toHaveBeenCalledTimes(1);
  });

  it('treats anonymous guest sessions as signed out', () => {
    useSession.mockReturnValue({
      data: { user: { id: 'guest', email: 'guest@example.test', name: '', isAnonymous: true } },
      isPending: false,
    });
    render(tree(new QueryClient()));
    expect(screen.getAllByText('signed out')).toHaveLength(3);
  });

  it('removes private cached data on logout while keeping the public ranking', () => {
    const client = new QueryClient();
    const view = render(tree(client));
    for (const root of ['entitlements', 'profile-username', 'recent-runs', 'run-history', 'leaderboard'])
      client.setQueryData([root, 'u1'], ['private']);
    useSession.mockReturnValue({ data: null, isPending: false });
    view.rerender(tree(client));
    for (const root of ['entitlements', 'profile-username', 'recent-runs', 'run-history'])
      expect(client.getQueryData([root, 'u1'])).toBeUndefined();
    expect(client.getQueryData(['leaderboard', 'u1'])).toEqual(['private']);
    client.clear();
  });
});
