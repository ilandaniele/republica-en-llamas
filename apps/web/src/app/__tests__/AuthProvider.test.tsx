import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

const unsubscribe = vi.fn();
const onAuthStateChange = vi.fn(() => ({ data: { subscription: { unsubscribe } } }));
const session = { user: { id: 'u1', app_metadata: {} } };

vi.mock('../../lib/supabase.js', () => ({
  ensureProfile: vi.fn(),
  supabase: {
    auth: {
      getSession: () => Promise.resolve({ data: { session } }),
      onAuthStateChange,
    },
  },
}));

const { AuthProvider } = await import('../AuthProvider.js');
const { useAuth } = await import('../../hooks/useAuth.js');

function UserId() {
  const { user, loading } = useAuth();
  return <span>{loading ? 'loading' : user?.id}</span>;
}

describe('AuthProvider', () => {
  it('shares one auth subscription across all useAuth consumers', async () => {
    const { unmount } = render(
      <AuthProvider>
        <UserId />
        <UserId />
        <UserId />
      </AuthProvider>,
    );

    expect(await screen.findAllByText('u1')).toHaveLength(3);
    expect(onAuthStateChange).toHaveBeenCalledTimes(1);

    unmount();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});
