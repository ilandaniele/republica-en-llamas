import { beforeEach, describe, expect, it, vi } from 'vitest';

const supabaseMock = vi.hoisted(() => ({
  isOfflineMode: false,
  supabase: {
    auth: { getSession: vi.fn(), signInAnonymously: vi.fn() },
    functions: { invoke: vi.fn() },
  },
}));
vi.mock('../supabase.js', () => supabaseMock);

import { claimRunTicket, currentAnonymousToken, requestRunTicket } from '../runTicket.js';

const { getSession, signInAnonymously } = supabaseMock.supabase.auth;
const { invoke } = supabaseMock.supabase.functions;

const session = (isAnonymous: boolean) => ({
  data: { session: { access_token: 'token', user: { is_anonymous: isAnonymous } } },
});

describe('requestRunTicket', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('signs guests in anonymously before calling start-run', async () => {
    getSession.mockResolvedValue({ data: { session: null } });
    signInAnonymously.mockResolvedValue({ data: { session: { access_token: 'guest' } }, error: null });
    invoke.mockResolvedValue({ data: { id: 'ticket-1', seed: 7 }, error: null });

    expect(await requestRunTicket()).toEqual({ id: 'ticket-1', seed: 7 });
    expect(signInAnonymously).toHaveBeenCalled();
  });

  it('returns null without calling start-run when anonymous sign-in fails', async () => {
    getSession.mockResolvedValue({ data: { session: null } });
    signInAnonymously.mockResolvedValue({ data: { session: null }, error: new Error('disabled') });

    expect(await requestRunTicket()).toBeNull();
    expect(invoke).not.toHaveBeenCalled();
  });

  it('returns the server-issued ticket for signed-in players', async () => {
    getSession.mockResolvedValue(session(false));
    invoke.mockResolvedValue({ data: { id: 'ticket-1', seed: 42 }, error: null });

    expect(await requestRunTicket()).toEqual({ id: 'ticket-1', seed: 42 });
    expect(invoke).toHaveBeenCalledWith('start-run');
    expect(signInAnonymously).not.toHaveBeenCalled();
  });

  it('returns null when start-run fails', async () => {
    getSession.mockResolvedValue(session(false));
    invoke.mockResolvedValue({ data: null, error: new Error('Failed to start run') });

    expect(await requestRunTicket()).toBeNull();
  });
});

describe('currentAnonymousToken', () => {
  it('returns the token only for anonymous sessions', async () => {
    getSession.mockResolvedValueOnce(session(true)).mockResolvedValueOnce(session(false));

    expect(await currentAnonymousToken()).toBe('token');
    expect(await currentAnonymousToken()).toBeNull();
  });
});

describe('claimRunTicket', () => {
  it('sends the guest token and ticket to claim-run-ticket', async () => {
    invoke.mockResolvedValue({ data: { claimed: true }, error: null });

    expect(await claimRunTicket('guest', 'ticket-1')).toBe(true);
    expect(invoke).toHaveBeenCalledWith('claim-run-ticket', {
      body: { anonymousToken: 'guest', ticketId: 'ticket-1' },
    });
  });

  it('reports a failed claim', async () => {
    invoke.mockResolvedValue({ data: null, error: new Error('Run cannot be claimed') });

    expect(await claimRunTicket('guest', 'ticket-1')).toBe(false);
  });
});
