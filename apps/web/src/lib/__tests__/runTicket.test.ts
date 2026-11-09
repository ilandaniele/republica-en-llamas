import { beforeEach, describe, expect, it, vi } from 'vitest';

const authClient = vi.hoisted(() => ({ getSession: vi.fn(), signIn: { anonymous: vi.fn() } }));
const apiSend = vi.hoisted(() => vi.fn());
vi.mock('../auth.js', () => ({ authClient }));
vi.mock('../api.js', () => ({ isOfflineMode: false, apiSend }));

import { requestRunTicket } from '../runTicket.js';

const { getSession } = authClient;
const anonymous = authClient.signIn.anonymous;

describe('requestRunTicket', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('signs guests in anonymously before calling start-run', async () => {
    getSession.mockResolvedValue({ data: null });
    anonymous.mockResolvedValue({ data: { user: { id: 'guest' } }, error: null });
    apiSend.mockResolvedValue({ ticketId: 'ticket-1', seed: 7 });

    expect(await requestRunTicket()).toEqual({ id: 'ticket-1', seed: 7 });
    expect(anonymous).toHaveBeenCalled();
  });

  it('returns null without calling start-run when anonymous sign-in fails', async () => {
    getSession.mockResolvedValue({ data: null });
    anonymous.mockResolvedValue({ data: null, error: { message: 'disabled' } });

    expect(await requestRunTicket()).toBeNull();
    expect(apiSend).not.toHaveBeenCalled();
  });

  it('returns the server-issued ticket for signed-in players', async () => {
    getSession.mockResolvedValue({ data: { user: { id: 'player' } } });
    apiSend.mockResolvedValue({ ticketId: 'ticket-1', seed: 42 });

    expect(await requestRunTicket()).toEqual({ id: 'ticket-1', seed: 42 });
    expect(apiSend).toHaveBeenCalledWith('start-run', {});
    expect(anonymous).not.toHaveBeenCalled();
  });

  it('falls back to local play when start-run fails', async () => {
    getSession.mockResolvedValue({ data: { user: { id: 'player' } } });
    apiSend.mockRejectedValue(new Error('Too many active runs'));

    expect(await requestRunTicket()).toBeNull();
  });

  it('falls back to local play when a session request throws', async () => {
    getSession.mockRejectedValueOnce(new Error('Network unavailable'));
    expect(await requestRunTicket()).toBeNull();
  });

  it('rejects malformed server tickets', async () => {
    getSession.mockResolvedValue({ data: { user: { id: 'player' } } });
    apiSend.mockResolvedValueOnce({ ticketId: 'ticket', seed: -1 });
    expect(await requestRunTicket()).toBeNull();
  });
});
