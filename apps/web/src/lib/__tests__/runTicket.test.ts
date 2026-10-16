import { beforeEach, describe, expect, it, vi } from 'vitest';

const supabaseMock = vi.hoisted(() => ({
  isOfflineMode: false,
  supabase: {
    auth: { getSession: vi.fn() },
    functions: { invoke: vi.fn() },
  },
}));
vi.mock('../supabase.js', () => supabaseMock);

import { requestRunTicket } from '../runTicket.js';

const { getSession } = supabaseMock.supabase.auth;
const { invoke } = supabaseMock.supabase.functions;

describe('requestRunTicket', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null for guests without calling start-run', async () => {
    getSession.mockResolvedValue({ data: { session: null } });

    expect(await requestRunTicket()).toBeNull();
    expect(invoke).not.toHaveBeenCalled();
  });

  it('returns the server-issued ticket for signed-in players', async () => {
    getSession.mockResolvedValue({ data: { session: { access_token: 'token' } } });
    invoke.mockResolvedValue({ data: { id: 'ticket-1', seed: 42 }, error: null });

    expect(await requestRunTicket()).toEqual({ id: 'ticket-1', seed: 42 });
    expect(invoke).toHaveBeenCalledWith('start-run');
  });

  it('returns null when start-run fails', async () => {
    getSession.mockResolvedValue({ data: { session: { access_token: 'token' } } });
    invoke.mockResolvedValue({ data: null, error: new Error('Failed to start run') });

    expect(await requestRunTicket()).toBeNull();
  });
});
