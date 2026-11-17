import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '../api.js';

const client = vi.hoisted(() => ({ signUp: { email: vi.fn() }, signOut: vi.fn() }));
const api = vi.hoisted(() => ({ apiGet: vi.fn(), apiSend: vi.fn() }));
vi.mock('better-auth/react', () => ({ createAuthClient: () => client }));
vi.mock('../api.js', async (importOriginal) => ({
  ApiError: (await importOriginal<typeof import('../api.js')>()).ApiError,
  isOfflineMode: false,
  ...api,
}));
vi.mock('../analytics.js', () => ({ trackTurnCompleted: vi.fn(), trackCrisisTriggered: vi.fn() }));

import { checkUsernameAvailable, signOut, signUp, translateAuthError } from '../auth.js';
import { useGameStore } from '../../stores/gameStore.js';

const created = { data: { user: { id: 'u1' } }, error: null };

beforeEach(() => {
  vi.clearAllMocks();
});

describe('translateAuthError', () => {
  it('does not reveal that an email is already registered', () => {
    const message = translateAuthError('User already exists. Use another email.');
    expect(message).not.toMatch(/email/i);
    expect(message).toMatch(/iniciá sesión/);
  });

  it('falls back to a generic message', () => {
    expect(translateAuthError('unexpected')).toBe('No se pudo completar la operación. Intentá de nuevo.');
  });

  it('translates rate limiting', () => {
    expect(translateAuthError('Too many requests. Please try again later.')).toMatch(/Esperá un minuto/);
  });
});

describe('signUp', () => {
  it('retries a transient username failure once', async () => {
    client.signUp.email.mockResolvedValue(created);
    api.apiSend
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
      .mockResolvedValueOnce({ username: 'ana' });
    expect(await signUp('a@b.co', 'password1', 'ana')).toEqual(created);
    expect(api.apiSend).toHaveBeenCalledTimes(2);
  });

  it('surfaces a username that could not be saved instead of dropping it', async () => {
    client.signUp.email.mockResolvedValue(created);
    api.apiSend.mockRejectedValue(new ApiError(503, 'Request failed'));
    const result = await signUp('a@b.co', 'password1', 'ana');
    expect(translateAuthError(result.error?.message ?? '')).toMatch(
      /no pudimos guardar tu nombre de usuario/,
    );
  });

  it('reports a username taken after the account was created without retrying', async () => {
    client.signUp.email.mockResolvedValue(created);
    api.apiSend.mockRejectedValue(new ApiError(409, 'Username taken'));
    const result = await signUp('a@b.co', 'password1', 'ana');
    expect(api.apiSend).toHaveBeenCalledOnce();
    expect(translateAuthError(result.error?.message ?? '')).toMatch(/Tu cuenta se creó, pero ese nombre/);
  });
});

describe('checkUsernameAvailable', () => {
  it('fails closed instead of reporting the name as available', async () => {
    api.apiGet.mockRejectedValue(new TypeError('Failed to fetch'));
    await expect(checkUsernameAvailable('ana')).rejects.toThrow();
  });
});

describe('signOut', () => {
  it('clears the persisted run so the next person on the device cannot resume it', async () => {
    client.signOut.mockResolvedValue({ data: { success: true }, error: null });
    useGameStore.setState({
      runTicketId: 'ticket-1',
      decisions: [{ kind: 'timeout', cardId: 'c' }],
      userId: 'u1',
    });
    await signOut();
    const state = useGameStore.getState();
    expect(state.runTicketId).toBeNull();
    expect(state.decisions).toEqual([]);
    expect(state.userId).toBeNull();
  });
});
