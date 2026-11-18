import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '../api.js';

const authClient = vi.hoisted(() => ({ getSession: vi.fn(), signIn: { anonymous: vi.fn() } }));
const apiSend = vi.hoisted(() => vi.fn());
vi.mock('../auth.js', () => ({ authClient }));
vi.mock('../api.js', async (importOriginal) => ({
  ApiError: (await importOriginal<typeof import('../api.js')>()).ApiError,
  isOfflineMode: false,
  apiSend,
}));

import { requestRunTicket } from '../runTicket.js';

const { getSession } = authClient;
const anonymous = authClient.signIn.anonymous;

function signedIn() {
  getSession.mockResolvedValue({ data: { user: { id: 'player' } } });
}

describe('requestRunTicket', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('signs guests in anonymously before calling start-run', async () => {
    getSession.mockResolvedValue({ data: null });
    anonymous.mockResolvedValue({ data: { user: { id: 'guest' } }, error: null });
    apiSend.mockResolvedValue({ ticketId: 'ticket-1', seed: 7 });

    expect(await requestRunTicket()).toEqual({ ticket: { id: 'ticket-1', seed: 7 }, error: null });
    expect(anonymous).toHaveBeenCalled();
  });

  it('reports a network failure without calling start-run when anonymous sign-in fails', async () => {
    getSession.mockResolvedValue({ data: null });
    anonymous.mockResolvedValue({ data: null, error: { message: 'disabled' } });

    expect(await requestRunTicket()).toEqual({ ticket: null, error: 'network' });
    expect(apiSend).not.toHaveBeenCalled();
  });

  it('returns the server-issued ticket for signed-in players', async () => {
    signedIn();
    apiSend.mockResolvedValue({ ticketId: 'ticket-1', seed: 42 });

    expect(await requestRunTicket()).toEqual({ ticket: { id: 'ticket-1', seed: 42 }, error: null });
    expect(apiSend).toHaveBeenCalledWith('start-run', {});
    expect(anonymous).not.toHaveBeenCalled();
  });

  it.each([
    [new ApiError(429, 'Daily run limit reached'), 'daily_cap'],
    [new ApiError(429, 'Too many requests'), 'rate_limit'],
    [new ApiError(500, 'Request failed'), 'unavailable'],
    [new TypeError('Failed to fetch'), 'network'],
  ])('classifies a start-run failure (%s) as %s', async (failure, expected) => {
    signedIn();
    apiSend.mockRejectedValue(failure);
    expect(await requestRunTicket()).toEqual({ ticket: null, error: expected });
  });

  it('reports a network failure when a session request throws', async () => {
    getSession.mockRejectedValueOnce(new Error('Network unavailable'));
    expect(await requestRunTicket()).toEqual({ ticket: null, error: 'network' });
  });

  it('rejects malformed server tickets', async () => {
    signedIn();
    apiSend.mockResolvedValueOnce({ ticketId: 'ticket', seed: -1 });
    expect(await requestRunTicket()).toEqual({ ticket: null, error: 'unavailable' });
  });
});
